import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Logger,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Products } from './schemas/products.schemas';
import axios from 'axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpExceptionFilter } from 'src/exceptions/http-exception.filter';
import { AllExceptionFilter } from 'src/exceptions/all-exception.filter';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Products')
@Controller('products')
@UseFilters(AllExceptionFilter)
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('batch')
  async findProductsByIds(
    @Body() requestData: { productIds: string[]; selectedFields: string[] },
  ): Promise<Products[]> {
    return new Promise(async (resolve, reject) => {
      // setTimeout(async () => {
      try {
        const { productIds, selectedFields } = requestData;
        const products = await this.productsService.findProductsByIds(
          productIds,
          selectedFields,
        );
        resolve(products);
      } catch (error) {
        console.error('Error fetching products by IDs:', error);
        reject([]);
      }
      // }, 5000); // Delay for 2 seconds
    });
  }
  @Get('search/:id')
  async findOrder(@Param('id') id: number) {
    try {
      const results = await this.productsService.searchProductById(id);

      return results;
    } catch (error) {
      throw new Error(`Error getting WooCommerce order: ${error.message}`);
    }
  }
  @Get('random/:count')
  async getRandomProducts(@Param('count') count: number) {
    // return count;
    return this.productsService.getRandomProducts(count);
  }
  @Post()
  // create(@Body()) {
  //   return this.productsService.create(createProductDto);
  // }
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('import')
  async getProducts() {
    let page = 1;
    const perPage = 100;
    let readyProducts = [];
    let imageSize = 'full'
    try {
      this.logger.log('<<<<<<<<<<<<<<<<<<<<<<<<<<< Started >>>>>>>>>>>>>');
      const publicDirectory = path.join(
        this.configService.get<string>('NEXT_IMAGES_PATH'),
      );
      // const publicDirectory = path.join(__dirname, '..','..', 'public');
      const imagesDirectory = path.join(publicDirectory, 'images');
      const productsDirectory = path.join(imagesDirectory, 'products');

      // this.logger.log('fs.existsSync(productsDirectory)')
      // Check if the 'public' directory exists, create it if not
      if (!fs.existsSync(publicDirectory)) {
        fs.mkdirSync(publicDirectory);
      }
      if (!fs.existsSync(imagesDirectory)) {
        fs.mkdirSync(imagesDirectory);
      }
      if (!fs.existsSync(productsDirectory)) {
        fs.mkdirSync(productsDirectory);
      }
      
      // return publicDirectory;
      while (true) {
        this.logger.log(
          `<<<<<<<<<<<<<<<<<<<<<<<<<<< Page ${page} >>>>>>>>>>>>>`,
        );
        this.logger.log(
          `${this.configService.get<string>(
            'WP_URL',
          )}?per_page=${perPage}&page=${page}`,
        );
        try {
          const response = await axios.get(
            `${this.configService.get<string>(
              'WP_URL',
            )}?per_page=${perPage}&page=${page}`,
            {
              auth: {
                username: this.configService.get('WC_API_USERNAME'),
                password: this.configService.get('WC_API_SECRET'),
              },
            },
          );

          if (response.data.length === 0) {
            // No more products to fetch
            break;
          }
          const products = await Promise.all(
            response.data.map(async (element) => {
              const attachmentId =
                element.meta_data.find((item) => item.key === 'pic_1')?.value ||
                '';

              if (element.images.length > 0) {
                const imageUrl = element.images[0].src;
                let thumbnailUrl = '';

                try {
                  if (attachmentId != '') {
                    const thumbnail = await axios.get(
                      `${this.configService.get<string>(
                        'WP_IMAGE_BASE_URL',
                      )}/wp-json/custom/v1/image-url/${attachmentId}/${imageSize}`,
                    );
                    if (thumbnail.data) {
                      thumbnailUrl = thumbnail.data;
                    }

                    this.logger.log(
                      `Attachment ID :>>>>> Element ID : ${element.id} : ATI ${attachmentId}`,
                    );
                  } else {
                    this.logger.log(
                      `Attachment ID :>>>>> Element ID :${element.id}`,
                    );
                  }

                  // const yoast = await axios.get(
                  //   `${this.configService.get<string>(
                  //     'WP_UPSELL_BASE',
                  //   )}/wp-json/wp/v2/product/${element.id}`
                  // );
                  // if(yoast.data){

                  //   if(element.id == 813836){
                  //     console.log('urlParts', yoast.data.yoast_head_json.schema['@graph'][0]['thumbnailUrl'])
                  //   }
                  //   element['styled_title'] = yoast.data.acf.styled_title;
                  //   thumbnailUrl =  yoast.data.yoast_head_json.schema['@graph'][0]['thumbnailUrl']

                  // }

                  const downloadUrl =
                    thumbnailUrl == '' ? imageUrl : thumbnailUrl;
                  // Download image and save to public/assets/product directory
                  const imageBuffer = await axios.get(downloadUrl, {
                    responseType: 'arraybuffer',
                  });

                  // Extract the file extension
                  const urlParts = downloadUrl.split('/');

                  const fileName = urlParts[urlParts.length - 1];
                  const fileExtension = fileName.split('.').pop();

                  const imagePath = path.join(productsDirectory, fileName);
                  const absolutePath = `/images/products/${fileName}`;
                  // this.logger.log(`NAME=> ${absolutePath}`);
                  // const imagePath = path.join(productsDirectory, `${element.id}.${fileExtension}`);
                  // const absolutePath = `public/images/products/${element.id}.${fileExtension}`;

                  if (!fs.existsSync(imagePath)) {
                    try {
                      fs.writeFileSync(
                        imagePath,
                        Buffer.from(imageBuffer.data),
                      );
                      element['image_url'] = absolutePath; // Add the image_url property to the element object
                    } catch (error) {
                      this.logger.error(
                        `Failed to store file =>  ${fileName}: ${error}`,
                      );
                    }
                  } else {
                    // File already exists
                    // this.logger.log(`File already exists: ${imagePath}`);
                    element['image_url'] = absolutePath; // Add the image_url property even if the file already exists
                  }
                } catch (error) {
                  this.logger.error(
                    `Error processing image => ${attachmentId}  --------  ${element.id}`,
                  );
                }
              } else {
                // image doesn't exists
                element['image_url'] = '';
              }
              // this.logger.log(element['image_url'])
              return element;
            }),
          );

          // return;
          readyProducts = readyProducts.concat(products);
          // break;
          page++;
        } catch (error) {
          this.logger.error('Error fetching products:', error);
          // break;
        }
      }

      if (readyProducts.length > 0) {
        this.logger.log(readyProducts.length);
        await this.productsService.clear();
        await this.productsService.create(readyProducts);
      } else {
        this.logger.error('Found no Products to fetch');
      }
    } catch (error) {
      throw Error(error.message);
    } finally {
      this.logger.debug('Import Request Completed');
      await this.productsService.updateUpsellProducts()
    }
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const apiUserName = this.configService.get<string>('WC_API_USERNAME');
    const apiUserSecret = this.configService.get<string>('WC_API_SECRET');
    const wp_url = this.configService.get<string>('WP_URL');
    try {
      const response = await axios.get(`${wp_url}/${id}`, {
        auth: {
          username: apiUserName,
          password: apiUserSecret,
        },
      });
      const product = response.data;
      const updatedProduct = await this.productsService.updateProduct(
        id,
        product,
      );
      return updatedProduct;
    } catch (error) {
      return error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(+id, updateProductDto);
  }

  @Get('sync-products/:id')
  async syncProduct(@Param('id') id: number) {
    return this.productsService.syncProduct(id);
  }
  @Post('sync-products-sale')
  async syncProductsSale(@Res() response,@Body() productIds:any):Promise<any> {
    const updatedCount =  await this.productsService.syncProductsSale(productIds['products']);
     
    // return updatedCount
        return response.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          success: +updatedCount > 0 ? true : false,
          message: +updatedCount>0 ? `${updatedCount} products updated successfully` : 'No products updated!',
          
        })
     
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
