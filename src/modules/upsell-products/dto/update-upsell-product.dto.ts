import { PartialType } from '@nestjs/mapped-types';
import { CreateUpsellProductDto } from './create-upsell-product.dto';

export class UpdateUpsellProductDto extends PartialType(
  CreateUpsellProductDto,
) {}
