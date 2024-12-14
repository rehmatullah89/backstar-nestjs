import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  Logger,
  Request,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import axios from 'axios';
import { AuthGuard } from '../auth/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';
import { ProductsService } from '../products/products.service';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  private readonly logger = new Logger('OrderController');

  constructor(
    private readonly OrderService: OrderService,
    private readonly configService: ConfigService,
    private readonly ProductsService: ProductsService,
  ) {}
  
  //@UseGuards(AuthGuard)
  @Get('import')
  @ApiQuery({ 
    description: 'You need to be logged in to import orders data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Import Request Completed.', data: 'Imports orders data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: fetching orders!',
  })
  async importOrders() {
    let offset = 300000;
    const limit = 200;
    const total_count = 350000;
    try {
      this.logger.log(
        '<<<<<<<<<<<<<<<<<<<<<< Script Execution Started >>>>>>>>>>>>>',
      );
      while (offset < total_count) {
        this.logger.log(
          `<<<<<<<<<<<<<<<<<<<<<<<<<<< Page ${offset} >>>>>>>>>>>>>`,
        );
        this.logger.log(
          `${this.configService.get<string>(
            'WP_ORDER_URL',
          )}?limit=${limit}&offset=${offset}`,
        );
        try {
          const response = await axios.get(
            `${this.configService.get<string>(
              'WP_ORDER_URL',
            )}?limit=${limit}&offset=${offset}`,
            {
              auth: {
                username: this.configService.get('WC_STABLE_API_USERNAME'),
                password: this.configService.get('WC_STABLE_API_SECRET'),
              },
            },
          );

          if (response.data.length === 0) {
            // No more orders to fetch
            break;
          }
          if (offset == 0) {
            await this.OrderService.clear();
          }
//          this.logger.debug("RESQP:", response.data);
          await this.OrderService.createOrders(response.data);

          offset += limit;
        } catch (error) {
          this.logger.error('Error fetching orders:', error);
          // break;
        }
      }
    } catch (error) {
      throw Error(error.message);
    } finally {
      this.logger.debug('Import Request Completed');
    }
  }

  @UseGuards(AuthGuard)
  @Get('import-missing-orders')
  @ApiQuery({ 
    description: 'You need to be logged in to import missing orders data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Import Request Completed.', data: 'Imports missing orders data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: fetching orders!',
  })
  async importMissingOrders() {
    let offset = 300000;
    const limit = 100;
    const total_count = 303033;
    try {
      this.logger.log(
        '<<<<<<<<<<<<<<<<<<<<<< Scrit Exexcution Started >>>>>>>>>>>>>',
      );
      while (offset < total_count) {
        this.logger.log(
          `<<<<<<<<<<<<<<<<<<<<<<<<<<< Page ${offset} >>>>>>>>>>>>>`,
        );
        this.logger.log(
          `${this.configService.get<string>(
            'WP_ORDER_URL',
          )}?limit=${limit}&offset=${offset}`,
        );
        try {
          const response = await axios.get(
            `${this.configService.get<string>(
              'WP_ORDER_URL',
            )}?limit=${limit}&offset=${offset}`,
            {
              auth: {
                username: this.configService.get('WC_API_USERNAME'),
                password: this.configService.get('WC_API_SECRET'),
              },
            },
          );

          if (response.data.length === 0) {
            // No more orders to fetch
            break;
          }

          // await this.OrderService.createOrders(response.data);
          response.data.forEach(async (order, index) => {
            const results = await this.OrderService.findByOrderId(order.id);

            if (results == null) {
              const newOrder = await this.OrderService.createOrder(order);
            }
          });

          offset += limit;
        } catch (error) {
          this.logger.error('Error fetching orders:', error);
          // break;
        }
      }
    } catch (error) {
      throw Error(error.message);
    } finally {
      this.logger.debug('Import Request Completed');
    }
  }

  @UseGuards(AuthGuard)
  @Get('duplicate-ids')
  @ApiQuery({ 
    description: 'You need to be logged in to get duplicate orders data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Duplicate count found.', data: 'Get duplicate orders data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: fetching orders!',
  })
  async findDuplicateIds(): Promise<string[]> {
    const duplicateIds = await this.OrderService.findDuplicateIds();
    console.log('Duplicate count:', duplicateIds.length);
    return duplicateIds;
  }

  @UseGuards(AuthGuard)
  @Post('remove-duplicates')
  @ApiQuery({ 
    description: 'You need to be logged in to remove duplicate orders data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Duplicate count found.', data: 'Remove duplicate orders data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Duplicate Orders Not Found!',
  })
  async removeDuplicates(): Promise<void> {
    await this.OrderService.findAndRemoveDuplicates();
  }

  //@UseGuards(AuthGuard)
  @Post('replace-order')
  @ApiBody({
    type: CreateOrderDto,
    description: 'Json structure for order data.',
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Order has been replaced successfully.', data: 'Complete order object'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order not replaced!',
  })
  async syncOrder(@Res() response, @Body() CreateOrderDto: CreateOrderDto) {
    try {
      await this.OrderService.removeOrder(CreateOrderDto.id);
      const data = await this.OrderService.createOrder(CreateOrderDto);
      this.logger.debug("order_created", data)
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order has been replaced successfully':'Order cannot be replaced.',
        data,
      });
    } catch (err) {
      this.logger.debug("order create error", err)
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order not replaced!',
        error: err.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiBody({
    type: CreateOrderDto,
    description: 'Json structure for order data.',
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Order has been created successfully.', data: 'Complete order object'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order not created!',
  })
  async createOrder(@Res() response, @Body() CreateOrderDto: CreateOrderDto) {
    try {
      const data = await this.OrderService.createOrder(CreateOrderDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order has been created successfully':'Order not created.',
        data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order not created!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  @ApiBody({
    type: CreateOrderDto,
    description: 'Json structure for order data.',
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Order has been updated successfully.', data: 'Complete order object'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order not updated!',
  })
  async updateOrder(
    @Res() response,
    @Param('id') orderId: string,
    @Body() UpdateOrderDto: UpdateOrderDto,
  ) {
    try {
      const data = await this.OrderService.updateOrder(
        orderId,
        UpdateOrderDto,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order has been updated successfully!':'Order cannot be updated.',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order not updated!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('all')
  @ApiQuery({ 
    description: 'You need to be logged in to get orders data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Orders data found successfully.', data: 'Get orders data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Orders not found!',
  })
  async getOrders(@Res() response) {
    try {
      const data = await this.OrderService.getAllOrders();
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Orders data found successfully.':'Orders data not found.',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Orders not found!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('customer-orders')
  @ApiQuery({ 
    description: 'You need to be logged in to get orders data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Orders found successfully.', data: 'Get Customer orders data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Customer orders not found!',
  })
  async findCustomerOrders(@Res() response, @Request() req) {
    try {
      const data = await this.OrderService.findOrdersByCustomerId(
        req._user.id,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Orders found successfully!':'Orders data not found.',
        data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce orders: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Customer orders not found!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('customer-subscriptions')
  @ApiQuery({ 
    description: 'You need to be logged in to get customer subscriptions data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Subscriptions found successfully.', data: 'Get Subscriptions orders data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Subscriptions not found!',
  })
  async findCustomerSubscriptions(@Res() response, @Request() req) {
    try {
      const data = await this.OrderService.searchCustomerOrders(
        req._user.id,
        1,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Subscriptions Found!':'Error while fetching subscriptions.',
        data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce orders: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Customer subscriptions not found!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('search-customer-orders/:customer_id/:subscription')
  @ApiQuery({ 
    description: 'You need to be logged in to search orders data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Data Found.', data: 'Search orders data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Customer orders not found!',
  })
  async searchCustomerOrders(
    @Res() response,
    @Param('customer_id') customer_id: number,
    @Param('subscription') subscription: number,
  ) {
    try {
      const data = await this.OrderService.searchCustomerOrders(
        customer_id,
        subscription,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Data Found!':'Error while searching orders.',
        data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce orders: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Customer orders not found!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('order-invoice/:id')
  @ApiQuery({ 
    description: 'You need to be logged in to get orders invoice because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'orders invoice found.', data: 'Order Invoice data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: orders invoice not found!',
  })
  async getOrderInvoice(@Res() response, @Param('id') id: number) {
    try {
      const data = await this.OrderService.getOrderInvoice(id);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Invoice Found.':'Error while fetching invoice.',
        data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce orders: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: orders invoice not found!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('shipping-countries-states')
  @ApiQuery({ 
    description: 'You need to be logged in to get Shipping countries list because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Data found successfully.', data: 'Shipping Countries data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Data not found!',
  })
  async getShippingCountriesStates(@Res() response, @Query('country') selectedCountry?: string) {
    try {
      const data = await this.OrderService.getShippingCountriesStates(
        selectedCountry,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Data found successfully!':'Data not found.',
        data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce orders: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Data not found!',
        error: 'Bad Request',
      });
    }
  }
  
  /*@UseGuards(AuthGuard)
  @Get('/:id')
  async getOrder(@Res() response, @Param('id') orderId: number) {
    try {
      const data = await this.OrderService.getOrder(orderId);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order found successfully!':'Order not found.',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order not found!',
        error: 'Bad Request',
      });
    }
  }*/

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiQuery({ 
    description: 'You need to be logged in to get orders because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Order found successfully.', data: 'Orders data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order not found!',
  })
  async findOrder(@Res() response, @Param('id') id: number) {
    try {
      // return id;
      const data = await this.OrderService.findByOrderId(+id);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order Found Successfully.':'Order data not found!',
        data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce order: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order not found!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('cancel-order')
  @ApiBody({
    schema: {
      example: [{id: 'order id i.e 123456', reason_cancellation: 'some reason', message: 'some message'}],
      description: 'Json structure for order object.',
    },
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Order has been cancelled successfully.', data: 'complete order object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order  cannot be cancelled!',
  })
  async cancelOrder(
    @Res() response,
    @Body()
    credentials: { id: number; reason_cancellation: string; message: string },
  ): Promise<{ access_token: string }> {
    try {
      const data = await this.OrderService.cancelOrder(
        credentials.id,
        credentials.reason_cancellation,
        credentials.message,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order cancelled successfully':'Order cannot be cancelled.',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: order cannot be cancelled!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('review-order-item')
  @ApiBody({
    schema: {
      example: [{user_id: '123456', product_id: '56789', comment_id: '11223', rating: '5', review: 'some review'}],
      description: 'Json structure for order object.',
    },
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Order has been reviewed successfully.', data: 'complete order object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order  cannot be reviewed!',
  })
  async reviewOrderItem(
    @Res() response,
    @Body()
    credentials: {
      user_id: number;
      product_id: number;
      comment_id: number;
      rating: number;
      review: string;
    },
  ): Promise<{ status: string }> {
    try {
      const data = await this.OrderService.reviewOrderItem(
        credentials.user_id,
        credentials.product_id,
        credentials.comment_id,
        credentials.rating,
        credentials.review,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order reviewed successfully.':'Order cannot be reviewed.',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order cannot be reviewed!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('cancel-order-item-subscription')
  @ApiBody({
    schema: {
      example: [{subscription_id: '123456', item_id: '56789'}],
      description: 'Json structure for order object.',
    },
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Order item subscription cancelled successfully.', data: 'complete order object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order item subscription cannot be cancelled!',
  })
  async cancelOrderItemSubscription(
    @Res() response,
    @Body()
    credentials: { subscription_id: number; item_id: number },
  ): Promise<{ status: string }> {
    try {
      const data = await this.OrderService.cancelOrderItemSubscription(
        credentials.subscription_id,
        credentials.item_id,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order item subscription cancelled successfully.':'Subscription cannot be cancelled.',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order item subscription cannot be cancelled!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('cancel-order-subscriptions')
  @ApiBody({
    schema: {
      example: [{id: 'order id i.e. 123456'}],
      description: 'Json structure for order object.',
    },
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Order subscription cancelled successfully.', data: 'complete order object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order subscription cannot be cancelled!',
  })
  async cancelOrderSubscriptions(
    @Res() response,
    @Body() credentials: { id: number },
  ): Promise<{ access_token: string }> {
    try {
      const data = await this.OrderService.cancelOrderSubscriptions(
        credentials.id,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order subscriptions cancelled successfully':'Subscriptions cannot be cancelled.',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order subscription cannot be cancelled!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('track-order-item')
  @ApiBody({
    schema: {
      example: [{id: 'order id i.e. 123456', item_id: 'item id i.e. 123456'}],
      description: 'Json structure for order object.',
    },
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Order status found successfully.', data: 'complete order object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order cannot be tracked!',
  })
  async trackOrderItem(
    @Res() response,
    @Body()
    credentials: { id: number; item_id: number },
  ): Promise<{ access_token: string }> {
    try {
      const data = await this.OrderService.trackOrderItem(
        credentials.id,
        credentials.item_id,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order status found successfully.':'Order status not found.',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order cannot be tracked!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('replace-return-order')
  @ApiBody({
    schema: {
      example: [{order_id: 'order id i.e. 123456', reason_refund: 'some reason', message: 'some text'}],
      description: 'Json structure for order object.',
    },
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Order has been replaced successfully.', data: 'complete order object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order cannot be returned!',
  })
  async replaceReturnOrder(
    @Res() response,
    @Body()
    credentials: { order_id: number; reason_refund: string; message: string },
  ): Promise<{ message: string }> {
    try {
      const data = await this.OrderService.replaceReturnOrder(
        credentials.order_id,
        credentials.reason_refund,
        credentials.message,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order has been replaced successfully':'Order cannot be replaced.',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order cannot be returned!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('buy-again-item')
  @ApiBody({
    schema: {
      example: [{product_id: 'product id i.e. 123456'}],
      description: 'Json structure for order object.',
    },
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Product found successfully.', data: 'complete product object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order item cannot buy again!',
  })
  async buyAgainItem(
    @Res() response,
    @Body()
    credentials: { product_id: number },
  ):  Promise<{ message: string }> {
    try {
      const data = await this.ProductsService.searchProductById(
        credentials.product_id,
      );
      //setup session for cart item to setup here....
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data ? 'Product found successfully' : 'No Product Found!',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order item cannot buy again!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  @ApiQuery({ 
    description: 'You need to be logged in to delete orders data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Ordes deleted successfully.', data: 'Delete order data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Orders cannot be deleted!',
  })
  async deleteOrder(@Res() response, @Param('id') orderId: string) {
    try {
      const data = await this.OrderService.deleteOrder(orderId);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Order deleted successfully':'Order cannot be deleted.',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order cannot be deleted!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('remove/:id')
  @ApiQuery({ 
    description: 'You need to be logged in to remove order data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Order removed successfully.', data: 'Delete Order data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Order Not found!',
  })
  async remove(@Res() response, @Param('id') id: number) {
    const data = await this.OrderService.removeOrder(+id);
    return response.status(HttpStatus.OK).json({
      statusCode: 200,
      success:data?true:false,
      message: data?'Successfully removed!':'Error while removing order!',
      data,
    });
  }

}
