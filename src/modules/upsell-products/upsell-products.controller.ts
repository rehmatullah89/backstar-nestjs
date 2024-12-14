import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseFilters,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpsellProductsService } from './upsell-products.service';
import { CreateUpsellProductDto } from './dto/create-upsell-product.dto';
import { UpdateUpsellProductDto } from './dto/update-upsell-product.dto';
import { plainToInstance, classToPlain } from 'class-transformer';
import axios, { AxiosResponse } from 'axios';
import { AllExceptionFilter } from 'src/exceptions/all-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Response } from 'express';

@ApiTags('Upsell Products')
@Controller('upsell-products')
@UseFilters(AllExceptionFilter)
export class UpsellProductsController {
  constructor(
    private readonly upsellProductsService: UpsellProductsService,
    private readonly configService: ConfigService,
  ) {}

  @Get('import')
  async create(@Res() res: Response) {
    try {
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
          return res.status(HttpStatus.CREATED).json({
            status: true,
            message: 'Upsell Products Imported',
            data: createdUpsellProducts,
          });
        }
      } else {
        console.error(
          `Failed to fetch Upsell data. Status: ${response.status}`,
        );
      }
    } catch (error) {
      throw new BadRequestException(error.message);
      // console.error('Error fetching Upsell data:', error.message);
    }
  }
  @Post('match')
  async findObjectsByProductIds(@Body() productIds: string[]): Promise<any[]> {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new BadRequestException('Invalid productIds provided');
    }

    const objects = await this.upsellProductsService.findObjectsByProductIds(
      productIds,
    );

    return objects;
  }

  @Get('upsell')
  async findAll() {
    return await this.upsellProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.upsellProductsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUpsellProductDto: UpdateUpsellProductDto,
  ) {
    return this.upsellProductsService.update(+id, updateUpsellProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.upsellProductsService.remove(+id);
  }
}
