import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserTicketDto {
  @ApiProperty({
    example: '12345',
    required: true
 })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'general_inquiry',
    required: false
 })
  @IsOptional()
  @IsString()
  type: string;


  @ApiProperty({
    example: 'image name',
    required: false
 })
  @IsOptional()
  // @IsString()
  attachment: any;

  @ApiProperty({
    example: '12345',
    required: false
 })
  @IsOptional()
  @IsNumber()
  ticket_id: number;

  @ApiProperty({
    example: 'xyz',
    required: false
 })
  @IsNotEmpty()
  @IsString()
  message: string;
}
