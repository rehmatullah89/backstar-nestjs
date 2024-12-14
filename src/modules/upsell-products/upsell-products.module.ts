import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UpsellProductsController } from './upsell-products.controller';
import { UpsellProductsService } from './upsell-products.service';
import {
  UpsellProduct,
  UpsellProductSchema,
} from './schema/upsell-products.schema';
import { Products, ProductSchema } from '../products/schemas/products.schemas';
import { ProductsModule } from '../products/products.module';
@Module({
  imports: [
    forwardRef(() => ProductsModule), // Import ProductsModule
    MongooseModule.forFeature([
      { name: UpsellProduct.name, schema: UpsellProductSchema },
      { name: Products.name, schema: ProductSchema }, // Include ProductsModel in MongooseModule.forFeature
    ]),
  ],
  controllers: [UpsellProductsController],
  providers: [UpsellProductsService],
  exports: [UpsellProductsService]
})
export class UpsellProductsModule {}
