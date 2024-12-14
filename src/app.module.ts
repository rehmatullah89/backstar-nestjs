import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './modules/products/products.module';
import { OrderModule } from './modules/orders/order.module';
import { CustomerModule } from './modules/customers/customer.module';
import { CartModule } from './modules/cart/cart.module';
import { HelperModule } from './modules/helpers/helper.module';
import { UpsellProductsModule } from './modules/upsell-products/upsell-products.module';
import { AuthModule } from './modules/auth/auth.module';
import { OptionsModule } from './modules/options/options.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: '.env',
    }),
    TasksModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dburl'),
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // authSource: 'darkstar',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CartModule,
    OrderModule,
    HelperModule,
    CustomerModule,
    ProductsModule,
    UpsellProductsModule,
    OptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
