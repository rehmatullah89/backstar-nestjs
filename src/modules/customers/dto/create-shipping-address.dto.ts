import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShippingAddressDto {
  @ApiProperty({
    example: '12345',
    required: true
 })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: '12345',
    required: false
 })
  @IsOptional()
  @IsNumber()
  address_id: number;

  @ApiProperty({
    example: 'abc',
    required: true
 })
  @IsNotEmpty()
  @IsString()
  shipping_first_name: string;

  @ApiProperty({
    example: 'abc',
    required: true
 })
  @IsNotEmpty()
  @IsString()
  shipping_last_name: string;

  @ApiProperty({
    example: 'abc',
    required: true
 })
  @IsNotEmpty()
  @IsString()
  shipping_address_1: string;

  @ApiProperty({
    example: 'abc',
    required: true
 })
  @IsOptional()
  @IsString()
  shipping_address_2: string;

  @ApiProperty({
    example: 'abc',
    required: true
 })
  @IsNotEmpty()
  @IsString()
  shipping_city: string;

  @ApiProperty({
    example: 'abc',
    required: true
 })
  @IsNotEmpty()
  @IsString()
  shipping_state: string;

  @ApiProperty({
    example: 'abc',
    required: true
 })
  @IsNotEmpty()
  @IsString()
  shipping_postcode: string;

  @ApiProperty({
    example: 'abc',
    required: true
 })
  @IsNotEmpty()
  @IsString()
  shipping_country: string;
}
