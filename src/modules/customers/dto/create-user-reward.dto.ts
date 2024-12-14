import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserRewardDto {
  @ApiProperty({
    example: '12345',
    required: false
 })
  @IsOptional()
  @IsNumber()
  affwp_user_id: number;

  @ApiProperty({
    example: 'abc',
    required: true
 })
  @IsNotEmpty()
  @IsString()
  affwp_user_name: string;

  @ApiProperty({
    example: 'abc',
    required: true
 })
  @IsNotEmpty()
  @IsString()
  affwp_user_login: string;

  @ApiProperty({
    example: 'abc@mail.com',
    required: true
 })
  @IsNotEmpty()
  @IsEmail()
  affwp_user_email: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  @IsString()
  affwp_user_pass: string;

  @ApiProperty({
    example: 'xyz@mail.com',
    required: false
 })
  @IsOptional()
  @IsEmail()
  affwp_payment_email: string;

  @ApiProperty({
    example: 'xyz',
    required: true
 })
  @IsNotEmpty()
  @IsUrl()
  affwp_user_url: string;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsOptional()
  @IsString()
  affwp_promotion_method: string;
}
