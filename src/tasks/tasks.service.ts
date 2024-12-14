import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { ProductsService } from '../modules/products/products.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private configService: ConfigService,
    private readonly productService: ProductsService,
  ) {} // Inject ProductService

  // @Cron('0 0 * * *')
  async handleCron() {
    let page = 1;
    let products = [];
    try {
      this.logger.log('<<<<<<<<<<<<<<<<<<<<<<<<<<< Started >>>>>>>>>>>>>');
      while (true) {
        this.logger.log(
          `<<<<<<<<<<<<<<<<<<<<<<<<<<< Started ${page} >>>>>>>>>>>>>`,
        );
        try {
          const response = await axios.get(
            `${this.configService.get<string>(
              'WP_URL',
            )}?per_page=1&page=${page}`,
            {
              auth: {
                username: this.configService.get('WC_API_USERNAME'),
                password: this.configService.get('WC_API_SECRET'),
              },
            },
          );

          if (response.data.length === 0) {
            // No more products to fetch
            break;
          }
          this.logger.log(`*********ID ${response.data[0]['id']}*********`);

          products = products.concat(response.data);
          page++;
        } catch (error) {
          this.logger.error('Error fetching products:', error);
          break;
        }
      }
      if (products.length > 0) {
        await this.productService.clear();
        await this.productService.create(products);
      } else {
        this.logger.error('Found no Products to fetch');
      }
    } catch (error) {
      throw Error(error.message);
    } finally {
      this.logger.debug('Import Request Completed');
    }
  }
}

//   @Interval(10000)
//   handleInterval() {
//     this.logger.debug('Called every 10 seconds');
//   }

//   @Timeout(5000)
//   handleTimeout() {
//     this.logger.debug('Called once after 5 seconds');
//   }
