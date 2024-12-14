import { IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsUrl, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerSocialDto {
  @ApiProperty({
    example: '12345',
    required: true
 })
  @IsNotEmpty()
  id: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Verify IsURL only if value is provided.',
  })
  @ValidateIf((o, value) => value !== null && value !== undefined && value !== '')
  @IsUrl()
  s_instagram: any;

  @ApiPropertyOptional({
    type: String,
    description: 'Verify IsURL only if value is provided.',
  })
  @ValidateIf((o, value) => value !== null && value !== undefined && value !== '')
  @IsUrl()
  s_twitter: any;

  @ApiPropertyOptional({
    type: String,
    description: 'Verify IsURL only if value is provided.',
  })
  @ValidateIf((o, value) => value !== null && value !== undefined && value !== '')
  @IsUrl()
  s_facebook: any;

  @ApiPropertyOptional({
    type: String,
    description: 'Verify IsURL only if value is provided.',
  })
  @ValidateIf((o, value) => value !== null && value !== undefined && value !== '')
  @IsUrl()
  s_youtube: any;

  @ApiPropertyOptional({
    type: String,
    description: 'Verify IsURL only if value is provided.',
  })
  @ValidateIf((o, value) => value !== null && value !== undefined && value !== '')
  @IsUrl()
  s_linkedin: any;

  @ApiPropertyOptional({
    type: String,
    description: 'Verify IsURL only if value is provided.',
  })
  @ValidateIf((o, value) => value !== null && value !== undefined && value !== '')
  @IsUrl()
  s_tikTok: any;

  @ApiPropertyOptional({
    type: String,
    description: 'Verify IsURL only if value is provided.',
  })
  @ValidateIf((o, value) => value !== null && value !== undefined && value !== '')
  @IsUrl()
  s_blog: any;
}
