import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { OrderController } from './order.controller';
import { ProductsService } from '../products/products.service';
import { OrderSchema, Order } from './schemas/order.schema';
import { CustomerService } from '../customers/customer.service';
import { ProductSchema } from '../products/schemas/products.schemas';
import { AuthGuard } from '../auth/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperService } from '../helpers/helper.service';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    AuthModule,
    ProductsModule,
    JwtModule.register({
      secret: '1234567890',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService, ProductsService, HelperService, AuthGuard, JwtService],
  exports: [
    OrderService,
    HelperService,
    ProductsService,
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Products', schema: ProductSchema },
    ]),
  ],
})
export class OrderModule {}
