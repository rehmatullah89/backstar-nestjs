import { BadRequestException, Injectable,NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from './schema/options.schema';
@Injectable()
export class OptionsService {
  constructor(@InjectModel('Option') private readonly optionModel: Model<Option>) {}

  async createOrUpdate(createOptionDto: CreateOptionDto) {
    // Check if the option already exists
    const existingOption = await this.optionModel.findOne({ key: createOptionDto.key });

    if (existingOption) {
      // If the option exists, update its value
      existingOption.value = createOptionDto.value;
      return existingOption.save();
    } else {
      // If the option does not exist, create it
      const createdOption = new this.optionModel(createOptionDto);
      return createdOption.save();
    }
  }
  async create(createOptionDto: CreateOptionDto) {
    const createdOption = new this.optionModel(createOptionDto);
    return createdOption.save();
  }

  async findAll() {
    return `This action returns all options`;
  }

  async findOne(key: string) {
    const option = await this.optionModel.findOne({ key }).exec();
    if (!option) {
      throw new NotFoundException('Option not found');
    }
    return option;
  }

  async update(key: string, updateOptionDto: UpdateOptionDto) {
    const option = await this.optionModel.findOneAndUpdate({ key }, updateOptionDto, { new: true }).exec();
    if (!option) {
      throw new NotFoundException('Option not found');
    }
    return option;
  }

  async remove(key: string) {
    const option = await this.optionModel.findOneAndDelete({ key }).exec();
    if (!option) {
      throw new NotFoundException('Option not found');
    }
    return option;
  }
}
