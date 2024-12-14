import {
  Logger,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { IOrder } from './interface/order.interface';
import { Model } from 'mongoose';
import { UpdateOrderDto } from './dto/update-order.dto';
import { HelperService } from '../helpers/helper.service';
import { Products } from '../products/schemas/products.schemas';

@Injectable()
export class OrderService {
  private readonly logger = new Logger('OrderService');
  constructor(
    @InjectModel('Order') private orderModel: Model<IOrder>,
    @InjectModel('Products') private readonly productsModel: Model<Products>,
    private readonly HelperService: HelperService,
  ) {}

  async createOrder(CreateOrderDto: CreateOrderDto): Promise<IOrder> {
    const newOrder = await new this.orderModel(CreateOrderDto);
    return newOrder.save();
  }

  async createOrders(CreateOrderDto: CreateOrderDto[]): Promise<IOrder[]> {
    const createdOrders = await this.orderModel.create(CreateOrderDto);
    return createdOrders;
  }

  async updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<IOrder> {
    const existingOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      updateOrderDto,
      { new: true },
    );
    if (!existingOrder) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    return existingOrder;
  }

  async getAllOrders(): Promise<IOrder[]> {
    const orderData = await this.orderModel.find();
    if (!orderData || orderData.length == 0) {
      throw new NotFoundException('Orders data not found!');
    }
    return orderData;
  }

  async getOrder(orderId: number): Promise<IOrder> {
    const existingOrder = await this.orderModel.findById(orderId).exec();
    if (!existingOrder) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    return existingOrder;
  }

  async deleteOrder(orderId: string): Promise<IOrder> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    return null;
  }

  async findByOrderId(id: number): Promise<IOrder[] | null> {
    try {
      //return this.orderModel.findOne({ id: id }).exec();
      /*return await this.orderModel.aggregate([
        {
          $match: { id: id } // Match the order by its id
        },
        {
          $lookup: {
            from: 'products', // Name of the products collection
            localField: 'line_items.product_id', // Field in the orders collection
            foreignField: 'id', // Field in the products collection
            as: 'products',
          },
        },
        {
          $project: {
            _id: 0, // Exclude the default _id field
            id: 1, // Include the orderId field
            image_url: '$products.image_url', // Include the prodImage field from line_items
            "meta_data._order_number_formatted": 1, 
            "date_created.date": 1, 
            "status": 1, 
            "total": 1, 
            "billing": 1,          
            "shipping": 1,          
            "shipping_method": 1,          
            "payment_method_title": 1,          
            "line_items.id": 1, 
            "line_items.product_id": 1, 
            "line_items.name": 1, 
            "line_items.total": 1, 
            "line_items.quantity": 1,
            "line_items.progress": 1,
            "line_items.status_title": 1,
            "line_items.tray_number": 1,              
            "line_items.tray_price2mm": 1,              
            "line_items.tray_price3mm": 1,              
          },
        },
      ]).exec();*/
      const params: any[] = [{ id: id }];
      const orders = await this.HelperService.getRequestData(
        'customer-order',
        params,
      );

      if (!orders) {
        throw new NotFoundException(`Orders #${orders} not found`);
      }
      return orders;
    } catch (error) {
      // Handle error
      return null;
    }
  }

  async findOrdersByCustomerId(customer_id: number): Promise<IOrder[]> {
    try {      
      /*return await this.orderModel.aggregate([
        {
          $match: { customer_id: customer_id } // Adding the $match stage to filter custid=303
        },
        {
          $lookup: {
            from: 'products', // Name of the products collection
            localField: 'line_items.product_id', // Field in the orders collection
            foreignField: 'id', // Field in the products collection
            as: 'products',
          },
        },
        {
          $project: {
            _id: 0, // Exclude the default _id field
            id: 1, // Include the orderId field
            image_url: '$products.image_url', // Include the prodImage field from line_items
            "meta_data._order_number_formatted": 1, 
            "date_created.date": 1, 
            "status": 1, 
            "total": 1,           
            "line_items.id": 1, 
            "line_items.product_id": 1, 
            "line_items.name": 1, 
            "line_items.total": 1, 
            "line_items.quantity": 1,
            "line_items.progress": 1,
            "line_items.status_title": 1,
            "line_items.tray_number": 1,              
            "line_items.tray_price2mm": 1,              
            "line_items.tray_price3mm": 1,              
          },
        },
        {
          $sort: { id: -1 } // Sort by orderId in descending order
        },
      ]);*/
      const params: any[] = [{ customer_id: customer_id }];
      const orders = await this.HelperService.getRequestData(
        'customer-orders',
        params,
      );

      if (!orders) {
        throw new NotFoundException(`Order #${orders} not found`);
      }
      return orders;
      
    } catch (error) {
      // Handle error
      return null;
    }
  }

  async searchCustomerOrders(
    customer_id: number,
    subscription: number,
  ): Promise<IOrder[]> {
    try {
      /*let query: any = { customer_id: customer_id };
      if (subscription != 0) {
        query = {
          customer_id: customer_id,
          'line_items.subscription_details' : { $exists: true, $not: { $size: 0 } },
          //          'subscription_orders.messages.resultCode': 'Ok',
          subscription_orders: { $exists: true },
        };
      }
      
        return await this.orderModel.aggregate([
          {
            $match: query // Adding the $match stage to filter custid=303
          },
          {
            $lookup: {
              from: 'products', // Name of the products collection
              localField: 'line_items.product_id', // Field in the orders collection
              foreignField: 'id', // Field in the products collection
              as: 'products',
            },
          },
          {
            $project: {
              _id: 0, // Exclude the default _id field
              id: 1, // Include the orderId field              
              "meta_data._order_number_formatted": 1, 
              "date_created.date": 1, 
              "status": 1, 
              "total": 1,           
              "line_items.id": 1, 
              "line_items.product_id": 1, 
              "line_items.name": 1,
              "line_items.total": 1,
              "line_items.quantity": 1,
              "line_items.progress": 1,
              "line_items.status_title": 1,
              "line_items.subscription_details": 1,
              image_url: '$products.image_url', // Include the prodImage field from line_items
              "subscription_orders.order_id": 1,
              "subscription_orders.subscription_id": 1,
              "subscription_orders.status": 1,
              "subscription_orders.total_price": 1,
              "subscription_orders.subscription_date": 1,
              "subscription_orders.interval_days": 1,
              "subscription_orders.next_order_date": 1,
              "subscription_orders.created_at": 1,
              "subscription_orders.item_id": 1,
              "subscription_orders.quantity": 1,
              "subscription_orders.product_id": 1,
              "subscription_orders.transaction_id": 1,
            },
          },
          {
            $sort: { id: -1 } // Sort by orderId in descending order
          },
        ]);*/
        const params: any[] = [{ customer_id: customer_id, subscription: subscription}];
        const orders = await this.HelperService.getRequestData(
        'customer-subscriptions',
        params,
      );

      if (!orders) {
        throw new NotFoundException(`Orders #${orders} not found`);
      }
      return orders;

    } catch (error) {
      // Handle error
      return null;
    }
  }

  async removeOrder(id: number) {
    try {
      return this.orderModel.findOneAndDelete({ id: id }).exec();
    } catch (error) {
      // Handle error
      return null;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.orderModel.deleteMany({});
    } catch (error) {
      throw new BadRequestException(`Error clearing orders before import.`);
    }
  }

  async findDuplicateIds(): Promise<string[]> {
    const pipeline = [
      {
        $group: {
          _id: '$id',
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ];

    const duplicateIds = await this.orderModel.aggregate(pipeline);

    return duplicateIds.map((duplicate) => duplicate._id.toString());
  }

  async findAndRemoveDuplicates(): Promise<void> {
    const pipeline = [
      {
        $group: {
          _id: { id: '$id' }, // Specify the fields for checking duplicates
          count: { $sum: 1 },
          duplicates: { $addToSet: '$_id' }, // Store the IDs of duplicate documents
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ];

    const duplicateGroups = await this.orderModel.aggregate(pipeline).exec();

    for (const group of duplicateGroups) {
      // Keep the first document (ID) and remove the rest of elements
      const [firstDocument, ...restDocuments] = group.duplicates;

      await this.orderModel.deleteMany({ _id: { $in: restDocuments } });
    }
  }

  async cancelOrder(
    id: number,
    reason_cancellation: string,
    message: string,
  ): Promise<IOrder> {
    try {
      const params = {id: id, reason_cancellation: reason_cancellation, message: message};
      return await this.HelperService.postRequestData('cancel-order', params);
    } catch (err) {
      throw new BadRequestException(`Error fetching valid order.`);
    }
  }

  async reviewOrderItem(
    user_id: number,
    product_id: number,
    comment_id: number,
    rating: number,
    review: string,
  ): Promise<IOrder> {
    try {
      const params = {"user_id":user_id, "product_id":product_id, "comment_id":comment_id, "rating":rating, "review":review};
      return await this.HelperService.postRequestData('review-order-item', params);
    } catch (err) {
      throw new BadRequestException(`Error fetching valid order.`);
    }
  }

  async cancelOrderItemSubscription(
    subscription_id: number,
    item_id: number,
  ): Promise<IOrder> {
    try {
      const params = {"subscription_id":subscription_id, "item_id":item_id};
      return await this.HelperService.postRequestData('cancel-order-item-subscription', params);
    } catch (err) {
      throw new BadRequestException(`Error fetching valid subscription.`);
    }
  }

  async trackOrderItem(id: number, item_id: number): Promise<IOrder> {
    try {
      const params = {"id":id, "item_id":item_id};
      return await this.HelperService.postRequestData('track-order-item', params);
    } catch (err) {
      throw new BadRequestException(`Error fetching valid order.`);
    }
  }

  async replaceReturnOrder(
    order_id: number,
    reason_refund: string,
    message: string,
  ): Promise<IOrder> {
    try {
      const params = {"order_id":order_id, "reason_refund":reason_refund, "message":message};
      return await this.HelperService.postRequestData('replace-return-order', params);
    } catch (err) {
      throw new BadRequestException(`Error fetching valid order.`);
    }
  }

  async cancelOrderSubscriptions(id: number): Promise<IOrder> {
    try {
      return await this.HelperService.postRequestData('cancel-order-subscriptions', {"id":id});
    } catch (err) {
      this.logger.error('Error fetching order data:', err);
      throw new BadRequestException(`Error fetching valid subscription order.`);
    }
  }

  async getOrderInvoice(id: number): Promise<IOrder> {
    try {
      let params:any[] = [{'id' : id}];
      return await this.HelperService.getRequestData('order-invoice', params);
    } catch (err) {
      this.logger.error('Error fetching order data:', err);
      throw new BadRequestException(`Error fetching valid order invoice.`);
    }
  }

  async syncOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<IOrder> {
    const existingOrder = await this.orderModel.findOneAndUpdate(
      { id: id },
      { $set: updateOrderDto },
      { new: true },
    );
    if (!existingOrder) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return existingOrder;
  }

  async getShippingCountriesStates(country: string): Promise<any> {
    try {
      const params: any[] = [{ country: country }];
      return await this.HelperService.getRequestData(
        'shipping-countries-states',
        params,
      );
    } catch (err) {
      return null;
    }
  }
}
