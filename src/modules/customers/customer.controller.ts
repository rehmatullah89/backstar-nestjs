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
} from '@nestjs/common';
import axios from 'axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerService } from './customer.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  private readonly logger = new Logger('OrderController');
  constructor(
    private readonly CustomerService: CustomerService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('duplicate-ids')
  @ApiQuery({ 
    description: 'You need to be logged in to access duplicate customers data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Success', data: 'user objects array.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: No Duplicates found!',
  })
  async findDuplicateIds(): Promise<string[]> {
    const duplicateIds = await this.CustomerService.findDuplicateIds();
    console.log('Duplicate count:', duplicateIds.length);
    return duplicateIds;
  }
  
  @Get('export')
  @ApiQuery({ 
    description: 'You need to be logged in to access customers data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Data export completed.', data: 'Generates Customers data csv.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: No Data found!',
  })
  async exportCustomers(@Res() response) {
    try {
      const currentDate = new Date();

      // Format the date to YYYYMMDD
      const formattedDate = `${currentDate.getFullYear()}${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;

      // Create a file name with the current date
      const filePath = `exports/0UNP${formattedDate}.csv`;
      const headerFields = [
        'Group Number',
        'Unique ID Number',
        'Last Name',
        'First Name',
        'Address Line 1',
        'Address Line 2',
        'City',
        'State Of Province',
        'Postal Code',
        'Country Code',
        'Phone',
        'Expiration Date',
        'Effective Date',
        'Sponsor/ Agent ID',
        'Optional Data 1',
        'Optional Data 2',
        'Optional Data 3',
        'No Market',
        'Enrollment Code',
        'Date of Birth',
        'Gender Code',
        'Email Address',
      ]; // Add your custom fields here
      const fieldsToFetch = [
        'group_number',
        'id',
        'last_name',
        'first_name',
        'address_1',
        'address_2',
        'city',
        'state',
        'postal_code',
        'country_code',
        'phone',
        'expiration_date',
        'effective_date',
        'sponsor_id',
        'optional_data1',
        'optional_data2',
        'optional_data3',
        'no_market',
        'enrollment_code',
        'date_of_birth',
        'gender_code',
        'email',
      ]; // Add your custom fields here

      await this.CustomerService.findAndExportToCsv(
        filePath,
        fieldsToFetch,
        headerFields,
      );

      return response.status(HttpStatus.OK).json({
        message: 'Data export completed.',
      });
    } catch (err) {
      return null; //response.status(err.status).json(err.response);
    }
  }

//  @UseGuards(AuthGuard)
  @Get('import')
  @ApiQuery({ 
    description: 'You need to be logged in to import customers data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Import Request Completed.', data: 'Imports Customers data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: fetching customers!',
  })
  async importCustomers() {
    let offset = 0;
    const limit = 1000;
    const total_count = 200000;
    try {
      this.logger.log(
        '<<<<<<<<<<<<<<<<<<<<<< Scrit Execution Started >>>>>>>>>>>>>',
      );
      while (offset < total_count) {
        this.logger.log(
          `<<<<<<<<<<<<<<<<<<<<<<<<<<< Page ${offset} >>>>>>>>>>>>>`,
        );
        this.logger.log(
          `${this.configService.get<string>(
            'WP_CUSTOMER_URL',
          )}?limit=${limit}&offset=${offset}`,
        );
        try {
          const response = await axios.get(
            `${this.configService.get<string>(
              'WP_CUSTOMER_URL',
            )}?limit=${limit}&offset=${offset}`,
            {
              auth: {
                username: this.configService.get('WC_STABLE_API_USERNAME'),
                password: this.configService.get('WC_STABLE_API_SECRET'),
              },
            },
          );
          

          if (response.data.length === 0) {
            // No more customers to fetch
            break;
          }

          await this.CustomerService.createCustomers(response.data);

          offset += limit;
        } catch (error) {
          this.logger.error('Error fetching customers:', error);
          // break;
        }
      }
    } catch (error) {
      throw Error(error.message);
    } finally {
      this.logger.debug('Import Request Completed');
    }
  }

  //@UseGuards(AuthGuard)
  @Post('replace-customer')
  @ApiBody({
    type: CreateCustomerDto,
    description: 'Json structure for customer data.',
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Customer has been replaced successfully.', data: 'complete Customer object'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Customer not replaced!',
  })
  async syncCustomer(
    @Res() response,
    @Body() CreateCustomerDto: CreateCustomerDto,
  ) {
    try {
      await this.CustomerService.removeCustomer(CreateCustomerDto.id);
      const customer = await this.CustomerService.createCustomer(
        CreateCustomerDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: customer?'Customer has been replaced successfully':'Not found.',
        customer,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Customer not replaced!',
        error: err.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiBody({
    type: CreateCustomerDto,
    description: 'Json structure for customer data.',
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Customer has been created successfully.', data: 'complete Customer object'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Customer not created!',
  })
  async createCustomer(
    @Res() response,
    @Body() CreateCustomerDto: CreateCustomerDto,
  ) {
    try {
      const data = await this.CustomerService.createCustomer(
        CreateCustomerDto,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Customer has been created successfully':'Customer Not Created!',
        data,        
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Customer not created!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Put()
  @ApiBody({
    type: CreateCustomerDto,
    description: 'Json structure for customer data.',
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Customer has been updated successfully.', data: 'complete Customer object'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Customer not updated!',
  })
  async updateCustomer(
    @Res() response,
    @Request() req,
    @Body() UpdateCustomerDto: UpdateCustomerDto,
  ) {
    try {
      const data = await this.CustomerService.updateCustomer(
        req._user.id,
        UpdateCustomerDto,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Customer has been updated successfully.':'Customer Not Found!',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Customer not updated!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('all')
  @ApiQuery({ 
    description: 'You need to be logged in to access customers data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'All customers data listed successfully.', data: 'Lists Customers data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Customers data not found!',
  })
  async getCustomers(@Res() response) {
    try {
      const data = await this.CustomerService.getAllCustomers();
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'All customers data listed successfully.':'Customers Not Found!',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Customers data not found!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('single')
  @ApiQuery({ 
    description: 'You need to be logged in to access customer data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Customer found successfully.', data: 'List Customer data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Customer not found!',
  })
  async getCustomer(@Res() response, @Request() req) {
    try {
      const data = await this.CustomerService.getCustomer(
        req._user.id,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Customer found successfully':'Customer Not Found!',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Customer not found!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  @ApiQuery({ 
    description: 'You need to be logged in to delete customer data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Customer deleted successfully.', data: 'Delete Customer data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Customer cannot be deleted!',
  })
  async deleteCustomer(@Res() response, @Param('id') customerId: string) {
    try {
      const data = await this.CustomerService.deleteCustomer(
        customerId,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Customer deleted successfully':'Customer cannot be deleted.',
        data,
      });
    } catch (err) {
      //return response.status(err.status).json(err.response);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Customer not deleted!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('find/:id')
  @ApiQuery({ 
    description: 'You need to be logged in to search customer data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Customer found successfully.', data: 'List Customer data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Customer not found!',
  })
  async findCustomer(@Res() response, @Param('id') id: number) {
    try {
      const data = await this.CustomerService.findByCustomerId(id);

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Customer found successfully':'Customer Not Found!',
        data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Customer not found!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('remove/:id')
  @ApiQuery({ 
    description: 'You need to be logged in to remove customer data because it uses jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Customer removed successfully.', data: 'Delete Customer data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Customer Not found!',
  })
  async remove(@Res() response, @Param('id') id: number) {
    const data = await this.CustomerService.removeCustomer(+id);
    return response.status(HttpStatus.OK).json({
      statusCode: 200,
      success:data?true:false,
      message: data?'Customer removed successfully':'Customer Not Found!',
      data,
    });
  }

  @UseGuards(AuthGuard)
  @Post('remove-duplicates')
  @ApiQuery({ 
    description: 'It removes duplicate customers data from MongoDB.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Duplicate Customers removed successfully.', data: 'Customer data.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Cannot delete customers!',
  })
  async removeDuplicates(@Res() response): Promise<void> {
    const data = await this.CustomerService.findAndRemoveDuplicates();
    return response.status(HttpStatus.OK).json({
      statusCode: 200,
      success:data?true:false,
      message: data?'Duplicate Customer removed successfully':'Cannot delete customers.',
      data,
    });
  }
}
