import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerSchema, Customer } from './schemas/customer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperService } from '../helpers/helper.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, HelperService, AuthGuard, JwtService],
  exports: [
    CustomerService,
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
    HelperService,
  ],
})
export class CustomerModule {}
