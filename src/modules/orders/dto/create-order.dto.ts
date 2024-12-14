import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: '12345',
    required: true
 })
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({
    example: '12345',
    required: false
 })
  @IsNumber()
  readonly parent_id: number;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly status: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly currency: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly version: string;

  @ApiProperty({
    example: true,
    required: false
 })
  @IsBoolean()
  readonly prices_include_tax: boolean;

  @ApiProperty({
    example: '2024-12-12 00:00:00',
    required: true
 })
  @IsNotEmpty()
  readonly date_created: [];

  @ApiProperty({
    example: '2024-12-12 00:00:00',
    required: true
 })
  @IsNotEmpty()
  readonly date_modified: [];

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly discount_total: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly discount_tax: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly shipping_total: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly shipping_tax: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly cart_tax: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly total: string;

  @ApiProperty({
    example: '123',
    required: false
 })
  @IsNumber()
  readonly customer_id: number;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly order_key: string;

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsObject()
  readonly billing: [];

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsObject()
  readonly shipping: [];

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly payment_method: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly payment_method_title: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly transaction_id: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly customer_ip_address: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly customer_user_agent: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly created_via: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly customer_note: string;

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsOptional()
  readonly date_completed: [];

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  readonly date_paid: [];

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly cart_hash: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  readonly order_stock_reduced: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  readonly download_permissions_granted: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  readonly new_order_email_sent: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  readonly recorded_sales: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  readonly recorded_coupon_usage_counts: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly number: string;

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsOptional()
  readonly shipping_method: string;

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsObject()
  readonly meta_data: [];

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsArray()
  readonly line_items: [];

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  readonly tax_lines: [];

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsOptional()
  readonly shipping_lines: [];

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsArray()
  readonly fee_lines: [];

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsArray()
  readonly coupon_lines: [];

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsArray()
  readonly order_notes: [];

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsArray()
  readonly easy_post_data: [];

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsArray()
  readonly subscription_orders: [];

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsOptional()
  readonly refunds: [];

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  readonly payment_url: string;

  @ApiProperty({
    example: true,
    required: false
 })
  @IsOptional()
  readonly is_editable: boolean;

  @ApiProperty({
    example: false,
    required: false
 })
  @IsOptional()
  readonly needs_payment: boolean;

  @ApiProperty({
    example: true,
    required: false
 })
  @IsOptional()
  readonly needs_processing: boolean;

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsOptional()
  readonly date_created_gmt: [];

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsOptional()
  readonly date_modified_gmt: [];

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsOptional()
  readonly date_completed_gmt: [];

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsOptional()
  readonly date_paid_gmt: [];

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  readonly currency_symbol: string;

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsOptional()
  readonly _links: [];
}
