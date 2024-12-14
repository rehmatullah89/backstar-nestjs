import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  Optional,
} from '@nestjs/common';
import { Products } from './schemas/products.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDto } from './dto/products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { CreateUpsellProductDto } from '../upsell-products/dto/create-upsell-product.dto';
import { plainToInstance } from 'class-transformer';
import { UpsellProductsService } from '../upsell-products/upsell-products.service';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectModel(Products.name) private readonly productsModel: Model<Products>,
    @Optional() private readonly upsellProductsService: UpsellProductsService,
    private configService: ConfigService,
  ) { }

  async findProductsByIds(
    productIds: string[],
    selectedFields: string[] = ['name', 'price', 'description', 'title'],
  ): Promise<Products[]> {
    try {
      const products = await this.productsModel
        .find({ id: { $in: productIds } })
        .select(selectedFields.join(' '))
        .exec();
      const sortedProducts = productIds.map((productId) =>
        products.find((product) => product.id == productId),
      );
      return sortedProducts.filter((product) => product);
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      throw error;
    }
  }
  findAll() {
    return `This action returns all products`;
  }
  async getProductById(productId: string): Promise<Products | null> {
    try {
      const product = await this.productsModel.findById(productId);
      return product;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }
  async updateProduct(
    productId: string | number,
    updatedFields: UpdateProductDto,
  ): Promise<Products | null> {
    try {
      const updatedProduct = await this.productsModel.findOneAndUpdate(
        { id: productId },
        { $set: updatedFields },
        { new: true },
      );
      if (!updatedProduct) {
        return null;
      }
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }
  async updateProducts(
    productIds: (string | number)[],
    updatedFields: UpdateProductDto[],
  ): Promise<any> {

    try {
      let updatedCount =  0;
      for (const product of updatedFields) {
        const { id, sale_price, price, on_sale } = product;
        
        if (productIds.includes(id)) {
          const updateResult = await this.productsModel.updateOne(
            { id: id },
            // { $set: { sale_price: sale_price , price:price , on_sale: on_sale } }
            { $set: product }
          );
          updatedCount++;
          console.log(`Updated product with ID ${id}:`, updateResult);
        }
      }
      return updatedCount;
    } catch (error) {
      console.error('Error updating products:', error);
      return null;
    }
  }
  async syncProduct(productId: string | number): Promise<any> {
    const url = this.configService.get<string>('WP_URL');
    const username = this.configService.get<string>('WC_API_USERNAME');
    const password = this.configService.get<string>('WC_API_SECRET');
    const wcProductUrl = `${url}/${productId}`;
    const response = await axios.get(wcProductUrl, {
      auth: {
        username,
        password,
      },
    });
    //   check if response is ok  and data exists in the body of the response
    if (response.status === 200 && response.data) {
      const product = response.data;
      const { meta_data, ...rest } = product;
      const transformedData = {
        ...rest,
        meta_data: meta_data.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {}),
      };
      return this.updateProduct(productId, transformedData);
    } else {
      throw new NotFoundException('Product not found');
    }
  }
  async syncProductsSale(productIds: any[]): Promise<any> {
    // return productIds
    const url = this.configService.get<string>('WP_URL');
    const username = this.configService.get<string>('WC_API_USERNAME');
    const password = this.configService.get<string>('WC_API_SECRET');
    const wcProductUrl = `${url}?include=${productIds.join(',')}`;
    // return wcProductUrl
    const response = await axios.get(wcProductUrl, {
      auth: {
        username,
        password,
      },
    });
    // return response;
    if (response.status === 200 && response.data) {
      const products = response.data;
      // return products
      const transformedProducts = products.map((product: any) => {
        const { meta_data, ...rest } = product;
        return {
          ...rest,
          meta_data: meta_data.reduce((acc: any, { key, value }: any) => {
            acc[key] = value;
            return acc;
          }, {}),
        };
      });
      return this.updateProducts(productIds, transformedProducts);
      return transformedProducts;


    } else {
      throw new NotFoundException('Product not found');
    }


  }

  async create(productsDto: ProductDto[]): Promise<Products[]> {
    const transformedData = productsDto.map((item) => {
      const { meta_data, ...rest } = item;
      return {
        ...rest,
        meta_data: meta_data.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {}),
      };
    });
    // this.logger.log(transformedData[0].meta_data)
    const createdProducts = await this.productsModel.create(transformedData);
    // await this.updateUpsellProducts();
    return createdProducts;
  }

  async getRandomProducts(count: number): Promise<Products[]> {
    try {
      const randomProducts = await this.productsModel.aggregate([
        { $sample: { size: +count } },
      ]);

      return randomProducts;
    } catch (error) {
      console.error('Error fetching random products:', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    try {
      await this.productsModel.deleteMany({});
    } catch (error) {
      throw new BadRequestException(`Error clearing products before import.`);
    }
  }
  async searchProductById(product_id: number): Promise<Products> {
    try {
      return this.productsModel.findOne({ id: product_id }).exec();
    } catch (error) {
      throw new BadRequestException(`Error fetching valid product.`);
    }
  }

  async updateUpsellProducts(){
    try {
      this.logger.debug('Starting Upsell Proudcts Syncing');
      
      // const response: AxiosResponse<any> = await axios.get('https://hamza.smilebrilliant.com/wp-json/custom/v1/get-upsell-products');
      const response: AxiosResponse<any> = await axios.get(
        `${this.configService.get<string>(
          'WP_UPSELL_BASE',
        )}/wp-json/custom/v1/get-upsell-products`,
      );
      let transformedData: CreateUpsellProductDto[] = [];

      if (response.status === 200) {
        const responseData = JSON.parse(response.data);

        for (const relatedProductId in responseData.related_products) {
          const id = relatedProductId;
          // console.log('relatedProductId>',relatedProductId)
          const products = responseData.related_products[relatedProductId];
          // console.log('products>',products)
          // Check if the related product ID exists in related_product_data
          if (responseData.related_product_data[id]) {
            const { title_show, offer_text, product_feature_image_url } =
              responseData.related_product_data[id];

            transformedData.push(
              plainToInstance(CreateUpsellProductDto, {
                id,
                products,
                title_show,
                offer_text,
                product_feature_image_url,
              }),
            );
          } else {
            console.error(`No data found for related product ID: ${id}`);
          }
        }

        if (transformedData.length > 0) {
          await this.upsellProductsService.clear();
          // console.log('transformedData', transformedData)
          const createdUpsellProducts = await this.upsellProductsService.create(
            transformedData,
          );
          
          this.logger.debug('Upsell Proudcts Synced');
          return true;
        }
      } else {
        console.error(
          `Failed to fetch Upsell data. Status: ${response.status}`,
        );
        return false;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
      // console.error('Error fetching Upsell data:', error.message);
    }
  }
  // async getRandomProducts(count: number): Promise<Products[]> {
  //     try {
  //         const randomProducts = await this.productsModel.aggregate([{ $sample: { size: count } }]);
  //         return randomProducts;
  //     } catch (error) {
  //         console.error('Error fetching random products:', error);
  //         return [];
  //     }
  // }
}
