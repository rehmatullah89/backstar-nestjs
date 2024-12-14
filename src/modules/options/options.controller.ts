import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@ApiTags('Options')
@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}
  @Post('store-or-update')
  storeOrUpdate(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.createOrUpdate(createOptionDto);
  }

  @Post()
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @Get()
  findAll() {
    return this.optionsService.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.optionsService.findOne(key);
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() updateOptionDto: UpdateOptionDto) {
    return this.optionsService.update(key, updateOptionDto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.optionsService.remove(key);
  }
  
}
