import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Logger,
  Get,
  Res,
  Param,
  Request,
  UseGuards,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateUserTicketDto } from '../customers/dto/update-user-ticket.dto';
import { CreateUserTicketDto } from '../customers/dto/create-user-ticket.dto';
import { UpdateCustomerSocialDto } from '../customers/dto/update-customer-social.dto';
import { CreateUserRewardDto } from '../customers/dto/create-user-reward.dto';
import { CreateShippingAddressDto } from '../customers/dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from '../customers/dto/update-shipping-address.dto';
import { CustomerService } from '../customers/customer.service';

@ApiTags('User')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');
  constructor(
    private readonly authService: AuthService,
    private readonly CustomerService: CustomerService,
  ) {}

  @Post('register-user')
  @ApiBody({
    schema: {
      example: [{field: 'email', value: 'abc@mindblazetech.com'}],
      description: 'Json structure for user object.',
    },
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'User has been created successfully.', data: 'complete user object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: User not created!',
  })
  async register(
    @Res() response,
    @Body()
    user: {
      email: string;
    },
  ) {
    try {
      const data = await this.authService.registerUser(
        user.email,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success: data?true:false,
        message: data?'User has been created successfully':'Error While creating new user!', 
        data,
      });
    } catch (error) {
      //throw new Error(`Error Register WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: User not created!',
        error: 'Bad Request',
      });
    }
  }

  @Post('login')
  @ApiBody({
    schema: {
      example: [{username: 'abc@gmail.com', password: '123456'}],
      description: 'Json structure for user login.',
    },
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Login Successful.', data: 'complete user object & jwt token.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Invalid username or password!',
  })
  async login(
    @Res() response, 
    @Body() credentials: { username: string; password: string },
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.authService.validateUser(
        credentials.username,
        credentials.password,
      );

      if(user){
        var token = await this.authService.login(user);
        await this.authService.updateUserToken(
          user.id,
          token,
        );
      }

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:user?true:false,
        message: user?'Login successful':'Invalid username or password!',
        data:{user,access_token:token}
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Cannot Login!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiQuery({ 
    description: 'You need to be logged in to access data as it will fetch request data from jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Success', data: 'complete user object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: User profile not found!',
  })
  async findCustomer( @Res() response, @Request() req) {
    try {
      const data = await this.CustomerService.findByCustomerId(req._user.id);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Success':'Error while fetching customer profile!',
        data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: User profile not found!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('update-customer')
  @ApiBody({
    schema: {
      example: [{user_firstname: 'abc', user_lastname: 'xyz', billing_phone:'+123456789'}],
      description: 'Json structure for user update.',
    },
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Customer has been updated successfully.', data: 'complete user object'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Update Customer Failed!',
  })
  async updateCustomer(
    @Res() response,
    @Request() req,
    @Body()
    user: {
      user_firstname: string;
      user_lastname: string;
      billing_phone: string;
    },
  ) {
    try {
      const data = await this.CustomerService.updateCustomerProfile(
        req._user.id,
        user.user_firstname,
        user.user_lastname,
        user.billing_phone,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success: data?true:false,
        message: data?'Customer has been updated successfully':'Error while updating customer!',
        data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Update Customer Failed!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('update-customer-social')
  @ApiBody({
    type: UpdateCustomerSocialDto,
    description: 'Json structure for user social profile update.',
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Customer social profile has been updated successfully.', data: 'complete user object'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Customer not found!',
  })
  async updateCustomerSocialProfile(
    @Res() response,
    @Body() UpdateCustomerSocialDto: UpdateCustomerSocialDto,
  ) {
    try {
      const data =
        await this.CustomerService.updateCustomerSocialProfile(
          UpdateCustomerSocialDto,
        );
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success: data?true:false,
        message: 'Customer social profile has been updated successfully',
        data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Customer not found!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('register-reward-user')
  @ApiBody({
    type: CreateUserRewardDto,
    description: 'Json structure for register user reward.',
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'User reward program has been registered successfully.', data: 'complete user object'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: User reward not registered!',
  })
  async registerRewardUser(
    @Res() response,
    @Body() CreateUserRewardDto: CreateUserRewardDto,
  ) {
    try {
      const data = await this.authService.registerRewardUser(
        CreateUserRewardDto,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success:data?true:false,
        message: 'User reward program has been registered successfully',
        data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: User reward not registed!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('affiliate-user')
  @ApiQuery({ 
    description: 'You need to be logged in to access data as it will fetch request data from jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Success', data: 'affiliate user data object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error:  Cannot find affiliate user!',
  })
  async getAffiliateUserData(@Res() response, @Request() req) {
    try {
      const data = await this.authService.getAffiliateUserDataById(
        req._user.id,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data
          ? 'Success'
          : 'Error: Affiliate User Not Found.',
          data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Cannot find affiliate user!',
        error: 'Bad Request',
      });
    }
  }
  
  @UseGuards(AuthGuard)
  @Post('affiliate-settings')
  @ApiBody({
    schema: {
      example: [{payment_email: 'abc@mail.com', rdh_recommended_url: 'xyz.com'}],
      description: 'Json structure for user update.',
    },
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Your affiliate profile has been updated.', data: 'complete affiliate user object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Updating Affiliate Settings Failed!',
  })
  async saveAffiliateSettings(
    @Res() response,
    @Request() req,
    @Body()
    user: {
      payment_email: string;
      rdh_recommended_url: string;
    },
  ) {
    try {
      const data = await this.authService.updateAffiliateSettings(
        req._user.id,
        user.payment_email,
        user.rdh_recommended_url,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success: data?true:false,
        message: data?'Your affiliate profile has been updated':'Error while updating affiliate settings!',
        data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Updating Affiliate Settings Failed!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @ApiBody({
    schema: {
      example: [{password: '12345', new_password: '67890'}],
      description: 'Json structure for password change.',
    },
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'Customer password has been updated successfully.', data: 'complete user object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Cannot change password!',
  })
  async changePassword(
    @Res() response,
    @Request() req,
    @Body()
    user: {
      password: string;
      new_password: string;
    },
  ) {
    try {
      const data = await this.CustomerService.updateCustomerPassword(
        req._user.id,
        user.password,
        user.new_password,
      );

      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success:data.status,
        message: data.status
          ? 'Customer password has been updated successfully'
          : 'Customer update password failed.',
        data,
      });
    } catch (error) {
      //throw new Error(`Error updating WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Cannot change password!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('json-web-token')
  @ApiBody({
    schema: {
      example: [{user_id: '12345', token: 'abc123267890'}],
      description: 'Json structure for jwt token.',
    },
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'JWT stored successfully.', data: 'complete user object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Cannot store jwt!',
  })
  async saveJasonWebToken(
    @Res() response,
    @Request() req,
  ) {
    try {
      const data = await this.authService.updateUserToken(
        req._user.id,
        req._token,
      );

      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success:data?true:false,
        message: data
          ? 'JWT stored successfully'
          : 'JWT storing failed.',
        data,
      });
    } catch (error) {
      //throw new Error(`Error updating WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Cannot store jwt!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('forgot-password')
  @ApiBody({
    schema: {
      example: [{email: 'abc@mail.com'}],
      description: 'Json structure for password forgot.',
    },
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Reset password email sent successfully.', data: 'complete user object'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Cannot reset password!',
  })
  async forgotPassword(
    @Res() response,
    @Request() req,
    @Body()
    user: {
      email: string;
    },
  ) {
    try {
      const data = await this.CustomerService.resetCustomerPassword(
        user.email,
      );

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: data?true:false,
        message: data
          ? 'Reset password email sent successfully.'
          : 'Password reset request failed.',
          data,
      });
    } catch (error) {
      //throw new Error(`Error updating WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Cannot reset password!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('user-shipping-addresses')
  @ApiQuery({ 
    description: 'You need to be logged in to access data as it will fetch request data from jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Success', data: 'complete user object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Cannot get user shipping address info!',
  })
  async findCustomerShippingAddresses(@Res() response, @Request() req) {
    try {
      const data = await this.authService.findShippingAddressesByUserId(
        req._user.id,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data
          ? 'Success'
          : 'Error while fetcing user shipping address.',
          data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Cannot get user shipping address info!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('user-billing-methods')
  @ApiQuery({ 
    description: 'You need to be logged in to access data as it will fetch request data from jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Success', data: 'complete user object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Cannot get user billing method info!',
  })
  async findCustomerBillingMethods(@Res() response, @Request() req) {
    try {
      const data = await this.authService.findBillingMethodsByUserId(
        req._user.id,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data
          ? 'Success'
          : 'Error while fetching user billing method.',
          data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Cannot get user billing method info!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('user-tickets')
  @ApiQuery({ 
    description: 'You need to be logged in to access data as it will fetch request data from jwt.' 
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Success', data: 'complete user tickets.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Cannot get user tickets!',
  })
  async getUserTickets(@Res() response, @Request() req) {
    try {
      const data = await this.authService.getUserTickets(
        req._user.id,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success:data?true:false,
        message: data
          ? 'Successful'
          : 'Error while fetching user tickets.',
          data,
      });
    } catch (error) {
      //throw new Error(`Error getting WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Cannot get user tickets!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('default-billing-method')
  @ApiBody({
    schema: {
      example: [{card_id: '12345', user_id: '67890'}],
      description: 'Sets Default Billing Methods.',
    },
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Billing address set as default successfully.', data: 'Billing Method object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Cannot set default address!',
  })
  async setDefaultBillingMethod(
    @Res() response,
    @Request() req,
    @Body()
    user: {
      card_id: number;
    },
  ) {
    try {
      const data = await this.CustomerService.setDefaultBillingMethod(
        user.card_id,
        req._user.id,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: data.status?true:false,
        message: data.status
          ? 'Billing address set as default successfully.'
          : 'Billing address cannot be set as default.',
          data,
      });
    } catch (error) {
      //throw new Error(`Error updating WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Cannot set Default address!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('delete-billing-method')
  @ApiBody({
    schema: {
      example: [{card_id: '12345', user_id: '67890'}],
      description: 'Delete Billing Methods.',
    },
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Billing address deleted successfully.', data: 'Billing Method object.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Cannot delete address!',
  })
  async deleteBillingMethod(
    @Res() response,
    @Request() req,
    @Body()
    user: {
      card_id: number;
    },
  ) {
    try {
      const data = await this.CustomerService.deleteBillingMethod(
        user.card_id,
        req._user.id,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: data?.status ? true : false,
        message: data?.status
          ? 'Billing address deleted successfully.'
          : 'Billing address cannot be deleted.',
        data,
      });
    } catch (error) {
      //throw new Error(`Error updating WooCommerce customer: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Cannot delete address!',
        error: 'Bad Request',
      });
    }
  }

  /*
It can create or update address on 
providing address_id=0 or valid id
*/
  @UseGuards(AuthGuard)
  @Post('update-shipping-address')
  @ApiBody({
    type: CreateShippingAddressDto,
    description: 'Json structure for updating shipping address.',
  })
  @ApiCreatedResponse({
    description: "{'success':true, 'statusCode':200, message: 'User shipping address updated successfully.', data: 'complete user object'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Shipping address not updated!',
  })
  async updateUserShippingAddress(
    @Res() response,
    @Body() CreateShippingAddressDto: CreateShippingAddressDto,
  ) {
    try {
      const data = await this.authService.updateUserShippingAddress(
          CreateShippingAddressDto,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'User shipping address updated successfully':'User shipping address cannot be updated.',
        data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Shipping address not updated!',
        error: 'Bad Request',
      });
    }
  }

  /*
  It can create or update ticket on 
  providing ticket_id=0 or valid id
  */
  @UseGuards(AuthGuard)
  @Post('user-create-ticket')
  @ApiBody({
    type: CreateUserTicketDto,
    description: 'Json structure for creating ticket.',
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'User ticket created successfully.', data: 'User Ticket not created!.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: User Ticket not created!',
  })
  async userCreateTicket(
    @Res() response,
    @Body() CreateUserTicketDto: CreateUserTicketDto,
  ) {
    try {
      const data = await this.authService.userCreateTicket(
        CreateUserTicketDto,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success:data?true:false,
        message: 'User ticket created successfully',
        data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: User Ticket not created!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('default-shipping-address')
  @ApiBody({
    type: CreateShippingAddressDto,
    description: 'Json structure for shipping.',
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'User default shipping address updated successfully.', data: 'User Shipping Address!.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Default shipping address not updated!',
  })
  async updateUserDefaultShippingAddress(
    @Res() response,
    @Body() UpdateShippingAddressDto: UpdateShippingAddressDto,
  ) {
    try {
      const data = await this.authService.updateUserDefaultShippingAddress(
          UpdateShippingAddressDto,
        );
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'User default shipping address updated successfully':'Invalid data request!',
        data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Default shipping address not updated!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('user-ticket-status')
  @ApiBody({
    type: CreateUserTicketDto,
    description: 'Json structure for ticket.',
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Ticket status updated successfully.', data: 'User ticket status!.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Ticket status not updated.!',
  })
  async userTicketStatus(
    @Res() response,
    @Body() UpdateUserTicketDto: UpdateUserTicketDto,
  ) {
    try {
      const data = await this.authService.userTicketStatus(
        UpdateUserTicketDto,
      );
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Ticket status updated successfully':'Ticket status cannot be updated!',
        data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Ticket status not updated!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('remove-shipping-address')
  @ApiBody({
    type: CreateShippingAddressDto,
    description: 'Json structure for ticket.',
  })
  @ApiOkResponse({
    description: "{'success':true, 'statusCode':200, message: 'Shipping address removed successfully.', data: 'User Shipping address status!.'}",
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Error: Shipping address id not found.!',
  })
  async deleteShippingAddress(
    @Res() response,
    @Body() UpdateShippingAddressDto: UpdateShippingAddressDto,
  ) {
    try {
      const data = await this.authService.deleteShippingAddress(UpdateShippingAddressDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        success:data?true:false,
        message: data?'Shipping address removed successfully':'Shipping address cannot be removed!',
        data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Shipping address id not found!',
        error: 'Bad Request',
      });
    }
  }
}
