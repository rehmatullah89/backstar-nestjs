import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsDate,
  isString,
  isBoolean,
  isNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDimensions {
  @IsString()
  length: string;

  @IsString()
  width: string;

  @IsString()
  height: string;
}

export class ProductImages {
  @IsString()
  imageid: string;

  @IsDate()
  date_created: Date;

  @IsDate()
  date_created_gmt: Date;

  @IsDate()
  date_modified: Date;

  @IsDate()
  date_modified_gmt: Date;

  @IsString()
  src: string;

  @IsString()
  name: string;

  @IsString()
  alt: string;
}

export class ProductCategories {
  @IsString()
  productid: string;

  @IsString()
  name: string;

  @IsString()
  slug: string;
}
export class ProductTags {
  @IsNumber()
  id: number;
  @IsString()
  name: string;
  @IsString()
  slug: string;
}
export class MetaDataItem {
  @IsNumber()
  id: number;

  @IsString()
  key: string;

  @IsNotEmpty()
  value: string | string[] | number;
}

export class CompositeComponentsDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly query_type: string;

  @IsArray()
  @IsNumber({}, { each: true })
  readonly query_ids: number[];

  @IsNumber()
  readonly default_option_id: number;

  @IsString()
  readonly thumbnail_id: string;

  @IsString()
  readonly thumbnail_src: string;

  @IsNumber()
  readonly quantity_min: number;

  @IsNumber()
  readonly quantity_max: number;

  @IsBoolean()
  readonly priced_individually: boolean;

  @IsBoolean()
  readonly shipped_individually: boolean;

  @IsBoolean()
  readonly optional: boolean;

  @IsString()
  readonly discount: string;

  @IsString()
  readonly options_style: string;

  @IsString()
  readonly pagination_style: string;

  @IsString()
  readonly display_prices: string;

  @IsBoolean()
  readonly show_sorting_options: boolean;

  @IsBoolean()
  readonly show_filtering_options: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  readonly attribute_filter_ids: number[];

  @IsString()
  readonly select_action: string;

  @IsBoolean()
  readonly product_title_visible: boolean;

  @IsBoolean()
  readonly product_descr_visible: boolean;

  @IsBoolean()
  readonly product_price_visible: boolean;

  @IsBoolean()
  readonly product_thumb_visible: boolean;

  @IsBoolean()
  readonly subtotal_visible_product: boolean;

  @IsBoolean()
  readonly subtotal_visible_cart: boolean;

  @IsBoolean()
  readonly subtotal_visible_orders: boolean;
}

export class CreateProductDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly slug: string;

  @IsString()
  readonly styled_title: string;
  
  @IsString()
  readonly image_url: string;

  @IsString()
  readonly permalink: string;

  @IsString()
  readonly date_created: string;

  @IsString()
  date_created_gmt: string;

  @IsDate()
  readonly date_modified: Date;
  @IsDate()
  readonly date_modified_gmt: Date;

  @IsString()
  readonly type: string;
  @IsString()
  readonly status: string;
  @IsBoolean()
  readonly featured: boolean;
  @IsString()
  readonly catalog_visibility: string;
  @IsString()
  readonly description: string;
  @IsString()
  readonly short_description: string;
  @IsString()
  readonly sku: string;
  @IsString()
  readonly price: string;
  @IsString()
  readonly regular_price: string;
  @IsString()
  readonly sale_price: string;
  @IsString()
  readonly date_on_sale_from: string;
  @IsString()
  readonly date_on_sale_from_gmt: string;
  @IsString()
  readonly date_on_sale_to: string;
  @IsString()
  readonly date_on_sale_to_gmt: string;
  @IsBoolean()
  readonly on_sale: boolean;
  @IsBoolean()
  readonly purchasable: boolean;
  @IsString()
  readonly total_sales: string;
  @IsBoolean()
  readonly virtual: boolean;
  @IsBoolean()
  readonly downloadable: boolean;

  readonly downloads: any[];
  @IsString()
  readonly download_limit: string;
  @IsString()
  readonly download_expiry: string;
  @IsString()
  readonly external_url: string;
  @IsString()
  readonly button_text: string;
  @IsString()
  readonly tax_status: string;
  @IsString()
  readonly tax_class: string;
  @IsBoolean()
  readonly manage_stock: boolean;
  @IsNumber()
  readonly stock_quantity: number;
  @IsString()
  readonly backorders: string;
  @IsBoolean()
  readonly backorders_allowed: boolean;
  @IsBoolean()
  readonly backordered: boolean;
  @IsString()
  readonly low_stock_amount: string;
  @IsString()
  readonly sold_individually: string;
  @IsString()
  readonly weight: string;

  @ValidateNested({ each: true })
  @Type(() => ProductDimensions)
  readonly dimensions: ProductDimensions[];

  @ValidateNested({ each: true })
  @Type(() => ProductImages)
  readonly images: ProductImages[];

  @ValidateNested({ each: true })
  @Type(() => ProductCategories)
  readonly categories: ProductCategories[];

  @IsBoolean()
  readonly shipping_required: boolean;

  @IsBoolean()
  readonly shipping_taxable: boolean;

  @IsString()
  readonly shipping_class: string;

  @IsNumber()
  readonly shipping_class_id: number;

  @IsBoolean()
  readonly reviews_allowed: boolean;

  @IsString()
  readonly average_rating: string;

  @IsNumber()
  readonly rating_count: number;

  // @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetaDataItem)
  readonly meta_data: MetaDataItem;

  @IsArray()
  @IsString({ each: true })
  readonly upsell_ids: string[];
  @IsArray()
  @IsString({ each: true })
  readonly cross_sell_ids: string[];
  @IsString()
  readonly parent_id: string;
  @IsArray()
  @IsString({ each: true })
  readonly purchase_note: string;
  @IsArray()
  @IsString({ each: true })
  readonly tags: string[];
  @IsArray()
  @IsString({ each: true })
  readonly attributes: string[];
  @IsArray()
  @IsString({ each: true })
  readonly default_attributes: string[];
  @IsArray()
  @IsString({ each: true })
  readonly variations: string[];

  @IsArray()
  @IsString({ each: true })
  readonly grouped_products: string[];

  @IsNumber()
  readonly menu_order: number;

  @IsString()
  readonly price_html: string;

  @IsArray()
  @IsString({ each: true })
  readonly related_ids: string[];
  // Add validation for other properties based on their types

  @IsBoolean()
  readonly composite_sold_individually_context: boolean;

  @IsString()
  readonly composite_shop_price_calc: string;

  @IsDate()
  readonly createdAt: Date;

  @IsString()
  readonly stock_status: string;

  @IsBoolean()
  readonly has_options: boolean;

  @IsString()
  readonly post_password: string;

  @IsBoolean()
  readonly composite_virtual: boolean;

  @IsString()
  readonly composite_layout: string;

  @IsBoolean()
  readonly composite_editable_in_cart: false;

  @IsString()
  readonly composite_components: CompositeComponentsDto[];

  @IsDate()
  readonly updatedAt: Date;
}
