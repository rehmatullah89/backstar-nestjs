import {  Logger, Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HelperService {
    private readonly logger = new Logger('HelperService');
    constructor(
        private readonly configService: ConfigService,        
    ) {}

    async getRequestData(url: string, params: any[]): Promise<any> {

        const queryString = params.map(obj => Object.entries(obj).map(([key, value]: [string, any]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')).join('&');               
        const ABC = `${this.configService.get<string>(
              'WC_BASE_URL',
            )}${url}?${queryString}`
            console.log("URL",ABC)
        const response = await axios.get(
            `${this.configService.get<string>(
              'WC_BASE_URL',
            )}${url}?${queryString}`,
            {
              auth: {
                username: this.configService.get('WC_API_USERNAME'),
                password: this.configService.get('WC_API_SECRET'),
              },
            },
          );
        return response?.data;
    }

    async postRequestData(url: string, params: any): Promise<any> {
      //this.logger.debug("URL:", `${this.configService.get<string>('WC_BASE_URL')}${url}`);
      //this.logger.debug("PARAMS:", params);
        const response = await axios({
            method: 'POST',
            url: `${this.configService.get<string>('WC_BASE_URL')}${url}`,
            auth: {
              username: this.configService.get('WC_STABLE_API_USERNAME'),
              password: this.configService.get('WC_STABLE_API_SECRET'),
            },
            data: params,
          });
          return response?.data;
    }
}