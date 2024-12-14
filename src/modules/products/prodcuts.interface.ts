export interface ProductCategories {
  productid: string;
  name: string;
  slug: string;
}
export interface ProductDimensions {
  length: string;
  width: string;
  height: string;
}
export interface ProductImages {
  imageid: string;
  date_created: Date;
  date_created_gmt: Date;
  date_modified: Date;
  date_modified_gmt: Date;
  src: string;
  name: string;
  alt: string;
}
export interface MetaDataItem {
  id: number;
  key: string;
  value: string | string[] | number;
}
export interface ProductTags {
  id: number;
  name: string;
  slug: string;
}

export interface compositeComponents {
  id: string;
  title: string;
  description: string;
  query_type: string;
  query_ids: number[];
  default_option_id: number;
  thumbnail_id: string;
  thumbnail_src: string;
  quantity_min: number;
  quantity_max: number;
  priced_individually: boolean;
  shipped_individually: boolean;
  optional: boolean;
  discount: string;
  options_style: string;
  pagination_style: string;
  display_prices: string;
  show_sorting_options: boolean;
  show_filtering_options: boolean;
  attribute_filter_ids: number[];
  select_action: string;
  product_title_visible: boolean;
  product_descr_visible: boolean;
  product_price_visible: boolean;
  product_thumb_visible: boolean;
  subtotal_visible_product: boolean;
  subtotal_visible_cart: boolean;
  subtotal_visible_orders: boolean;
}
