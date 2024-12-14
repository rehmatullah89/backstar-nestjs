import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema,CartItem,CartItemSchema } from './schemas/cart.schema';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { ProductsService } from '../products/products.service';
import { Products, ProductSchema } from '../products/schemas/products.schemas';
import { ProductsModule } from '../products/products.module';
@Module({
  imports: [
    ProductsModule,
    AuthModule,
    JwtModule.register({
      secret: '1234567890',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      {name: Cart.name, schema: CartSchema},
      {name: CartItem.name, schema: CartItemSchema},
      {name:Products.name,schema:ProductSchema}
    ]),
  ],
  controllers: [CartController],
  providers: [CartService,ProductsService],
})
export class CartModule {}
