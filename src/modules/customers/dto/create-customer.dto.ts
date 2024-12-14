import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface MetaDataItem {
  id: number;
  key: string;
  value: string | string[] | number;
}

export class CreateCustomerDto {
  @ApiProperty({
    example: '12345',
    required: true
 })
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({
    example: '2024-12-12 00:00:00',
    required: false
 })
  @IsOptional()
  readonly date_created: [];

  @ApiProperty({
    example: '2024-12-12 00:00:00',
    required: false
 })
  @IsOptional()
  readonly date_modified: [];

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly email: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly first_name: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly last_name: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly role: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly username: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  @IsString()
  readonly password: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsString()
  readonly display_name: string;

  @ApiProperty({
    example: '[{abc:xyz}]',
    required: false
 })
  @IsObject()
  readonly billing: [];

  @ApiProperty({
    example: '[{abc:xyz}]',
    required: false
 })
  @IsObject()
  readonly shipping: [];

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  readonly is_paying_customer: string;

  @ApiProperty({
    example: 'xyz.com',
    required: false
 })
  @IsString()
  readonly avatar_url: string;

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsOptional()
  readonly meta_data: MetaDataItem[];

  @ApiProperty({
    example: 'xyz.com',
    required: false
 })
  @IsOptional()
  @IsUrl()
  s_instagram: string;

  @ApiProperty({
    example: '[]',
    required: false
 })
  @IsOptional()
  @IsUrl()
  readonly _links: [];
}
