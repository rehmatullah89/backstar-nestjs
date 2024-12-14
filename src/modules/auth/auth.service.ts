import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ICustomer } from '../customers/interface/customer.interface';
import { CustomerService } from '../customers/customer.service';
import { HelperService } from '../helpers/helper.service';
import { CreateUserTicketDto } from '../customers/dto/create-user-ticket.dto';
import { CustomerSchema } from '../customers/schemas/customer.schema';
import { UpdateUserTicketDto } from '../customers/dto/update-user-ticket.dto';
import { CreateUserRewardDto } from '../customers/dto/create-user-reward.dto';
import { UpdateShippingAddressDto } from '../customers/dto/update-shipping-address.dto';
import { CreateShippingAddressDto } from '../customers/dto/create-shipping-address.dto';
import { response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    private readonly customerService: CustomerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly HelperService: HelperService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ICustomer | null> {
    try {
      const params: any[] = [{ username: username, password: password }];
      const response = await this.HelperService.getRequestData(
        'login-customer',
        params,
      );

      /*if (response && response?.success) {
        const user = await this.customerService.findByCustomerId(response.id);
        return user;
      }*/

      return response?response.data:null;
    } catch (error) {
      //this.logger.error('Error Logging customer:', error);
      return null;
    }
  }

  async login(user: ICustomer): Promise<string> {
    const payload = { id:user.id, username: user.username, email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_TOKEN'),
      expiresIn: this.configService.get('JWT_EXPIRE_TIME'),
    });
  }

  async registerRewardUser(
    CreateUserRewardDto: CreateUserRewardDto,
  ): Promise<ICustomer> {
    try {
      return await this.HelperService.postRequestData(
        'register-reward-user',
        CreateUserRewardDto,
      );
    } catch (err) {
      return null;
    }
  }

  async updateAffiliateSettings(
    user_id: string,
    payment_email: string,
    rdh_recommended_url: string,
  ): Promise<ICustomer> {
    try {
      const params = {
        user_id: user_id,
        payment_email: payment_email,
        rdh_recommended_url: rdh_recommended_url,
      };
      return await this.HelperService.postRequestData(
        'affiliate-settings',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  async registerUser(
    email: string,
  ): Promise<ICustomer> {
    try {
      const params = {
        email: email,
      };
      return await this.HelperService.postRequestData(
        'register-user',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  async updateUserToken(
    user_id: number,
    jwt: string,
  ): Promise<ICustomer> {
    try {
      const params = {
        user_id: user_id,
        jwt_token: jwt,
      };

      return await this.HelperService.postRequestData(
        'jwt-auth',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  async updateUserShippingAddress(
    CreateShippingAddressDto: CreateShippingAddressDto,
  ): Promise<ICustomer> {
    try {
      return await this.HelperService.postRequestData(
        'update-shipping-address',
        CreateShippingAddressDto,
      );
    } catch (err) {
      return null;
    }
  }

  async userCreateTicket(
    CreateUserTicketDto: CreateUserTicketDto,
  ): Promise<ICustomer> {
    try {
      return await this.HelperService.postRequestData(
        'user-create-ticket',
        CreateUserTicketDto,
      );
    } catch (err) {
      return null;
    }
  }

  async updateUserDefaultShippingAddress(
    UpdateShippingAddressDto: UpdateShippingAddressDto,
  ): Promise<ICustomer> {
    try {
      return await this.HelperService.postRequestData(
        'default-shipping-address',
        UpdateShippingAddressDto,
      );
    } catch (err) {
      return null;
    }
  }

  async userTicketStatus(
    UpdateUserTicketDto: UpdateUserTicketDto,
  ): Promise<ICustomer> {
    try {
      return await this.HelperService.postRequestData(
        'user-ticket-status',
        UpdateUserTicketDto,
      );
    } catch (err) {
      return null;
    }
  }

  async deleteShippingAddress(
    UpdateShippingAddressDto: UpdateShippingAddressDto,
  ): Promise<ICustomer> {
    try {
      return await this.HelperService.postRequestData(
        'remove-shipping-address',
        UpdateShippingAddressDto,
      );
    } catch (err) {
      this.logger.error('Error fetching dataaaa:', err.response.data);
      return null;
    }
  }

  async findShippingAddressesByUserId(
    user_id: number,
  ): Promise<ICustomer> {
    try {
      const params: any[] = [{user_id: user_id}];
      return await this.HelperService.getRequestData(
        'user-shipping-addresses',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  async getAffiliateUserDataById(
    user_id: number,
  ): Promise<ICustomer> {
    try {
      const params: any[] = [{user_id: user_id}];
      return await this.HelperService.getRequestData(
        'affiliate-user',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  async findBillingMethodsByUserId(user_id: number): Promise<ICustomer | []> {
    try {
      const params: any[] = [{ user_id: user_id }];
      return await this.HelperService.getRequestData(
        'user-billing-methods',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  async getUserTickets(user_id: number): Promise<ICustomer | []> {
    try {
      const params: any[] = [{ user_id: user_id }];
      return await this.HelperService.getRequestData(
        'user-support-messages',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get('JWT_TOKEN'),
    });
  }
}
