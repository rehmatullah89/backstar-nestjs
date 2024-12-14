import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { CustomerService } from '../customers/customer.service';
import { AuthController } from './auth.controller';
import { CustomerSchema, Customer } from '../customers/schemas/customer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from './auth.guard';
import { HelperService } from '../helpers/helper.service';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: '1234567890',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CustomerService,
    JwtService,
    AuthGuard,
    HelperService,
  ],
  exports: [
    AuthService,
    HelperService,
    CustomerService,
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
  ],
})
export class AuthModule {}
