import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Option,OptionSchema } from './schema/options.schema';
@Module({
  imports: [
   
    MongooseModule.forFeature([
      { name: Option.name, schema: OptionSchema }// Include ProductsModel in MongooseModule.forFeature
    ]),
  ],
  controllers: [OptionsController],
  providers: [OptionsService],
})
export class OptionsModule {}
