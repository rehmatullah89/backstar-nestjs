import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductSchema, Products } from './schemas/products.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UpsellProductsModule } from '../upsell-products/upsell-products.module';
@Module({
  imports: [
    UpsellProductsModule,
    MongooseModule.forFeature([{ name: Products.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [
    ProductsService,
    MongooseModule.forFeature([{ name: Products.name, schema: ProductSchema }]),
  ],
})
export class ProductsModule {}
