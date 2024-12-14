import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ICustomer } from './interface/customer.interface';
import { Model } from 'mongoose';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as fs from 'fs';
import * as createCsvWriter from 'csv-writer';
import { HelperService } from '../helpers/helper.service';
import { UpdateCustomerSocialDto } from './dto/update-customer-social.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger('CustomerService');
  constructor(
    @InjectModel('Customer') private customerModel: Model<ICustomer>,
    private readonly HelperService: HelperService,
  ) {}

  async findAndExportToCsv(
    filePath: string,
    fields: string[],
    headers: string[],
  ): Promise<void> {
    try {
      const users = await this.customerModel.find().exec();

      const usersData = [];
      for (const item of users) {
        // Iterate over the keys of the main object
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            //             console.log(`first Key: ${key} , Value: ${item[key].last_name}`);
            //            console.log(`sec Key: ${key} & ${item[key]}, Value: ${item[key].first_name}`);
            const jsonObj = {};
            jsonObj['group_number'] = 1;
            jsonObj['id'] = String(item[key].id).padStart(6, '0');

            // If the value is an object, iterate over its keys
            if (typeof item[key] === 'object' && item[key] !== null) {
              for (const subKey in item[key]) {
                //console.log(` Key: ${subKey} , Value: ${item[key][subKey]}`);

                if (subKey == 'last_name')
                  jsonObj['last_name'] = item[key][subKey].replace(/,/g, '');

                if (subKey == 'first_name')
                  jsonObj['first_name'] = item[key][subKey].replace(/,/g, '');

                if (item[key].hasOwnProperty(subKey) && subKey == 'billing') {
                  for (const subKey2 in item[key][subKey]) {
                    //console.log('SSSS', item[key][subKey][subKey2].address_1);
                    jsonObj['address_1'] = item[key][subKey][
                      subKey2
                    ].address_1.replace(/,/g, '');
                    jsonObj['address_2'] = item[key][subKey][
                      subKey2
                    ].address_2.replace(/,/g, '');
                    jsonObj['city'] = item[key][subKey][subKey2].city;
                    jsonObj['state'] = item[key][subKey][subKey2].state;
                    jsonObj['postal_code'] =
                      item[key][subKey][subKey2].postcode;
                    jsonObj['country_code'] =
                      item[key][subKey][subKey2].country;
                    jsonObj['phone'] = item[key][subKey][subKey2].phone;
                    jsonObj['expiration_date'] = '';
                    jsonObj['effective_date'] = '';
                    jsonObj['sponsor_id'] = '';
                    jsonObj['optional_data1'] = '';
                    jsonObj['optional_data2'] = '';
                    jsonObj['optional_data3'] = '';
                    jsonObj['no_market'] = '';
                    jsonObj['enrollment_code'] = '';
                    jsonObj['date_of_birth'] = '';
                    jsonObj['gender_code'] = '';
                    jsonObj['email'] = item[key][subKey][subKey2].email;
                  }
                  usersData.push(jsonObj);
                }
              }
            }
          }
        }
      }

      // Write data to CSV file
      const csvWriterInstance = createCsvWriter.createObjectCsvWriter({
        path: filePath,
        header: headers.map((header, index) => ({
          id: fields[index],
          title: header,
        })),
      });
      //console.log('users:', usersData);
      await csvWriterInstance.writeRecords(usersData);

      console.log(`Data written to ${filePath} successfully.`);
    } catch (error) {
      console.error('Error fetching and exporting data to CSV:', error);
    }
  }

  async createCustomer(
    CreateCustomerDto: CreateCustomerDto,
  ): Promise<ICustomer> {
    const newCustomer = await new this.customerModel(CreateCustomerDto);
    return newCustomer.save();
  }

  async createCustomers(
    CreateCustomerDto: CreateCustomerDto[],
  ): Promise<ICustomer[]> {
    const createdCustomers = await this.customerModel.create(CreateCustomerDto);
    return createdCustomers;
  }

  async updateCustomer(
    customerId: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<ICustomer> {
    const existingCustomer = await this.customerModel.findByIdAndUpdate(
      customerId,
      updateCustomerDto,
      { new: true },
    );
    if (!existingCustomer) {
      throw new NotFoundException(`Customer #${customerId} not found`);
    }
    return existingCustomer;
  }

  async getAllCustomers(): Promise<ICustomer[]> {
    const customerData = await this.customerModel.find().limit(10).exec();
    if (!customerData || customerData.length == 0) {
      throw new NotFoundException('Customers data not found!');
    }
    return customerData;
  }

  async getCustomer(customerId: number): Promise<ICustomer> {
    const existingCustomer = await this.customerModel
      .findById(customerId)
      .exec();
    if (!existingCustomer) {
      throw new NotFoundException(`Customer #${customerId} not found`);
    }
    return existingCustomer;
  }

  async deleteCustomer(customerId: string): Promise<ICustomer> {
    const deletedCustomer = await this.customerModel.findByIdAndDelete(
      customerId,
    );
    if (!deletedCustomer) {
      throw new NotFoundException(`Customer #${customerId} not found`);
    }
    return null;
  }

  async findByCustomerId(id: number): Promise<ICustomer> {
    try {
      //const customer = await this.customerModel.findOne({ id: id }).exec();
      const params: any[] = [{ id: id }];
      const customer = await this.HelperService.getRequestData(
        'get-customer',
        params,
      );

      if (!customer) {
        throw new NotFoundException(`Customer #${id} not found`);
      }
      return customer;
    } catch (error) {
      // Handle error
      return null;
    }
  }

  async updateCustomerProfile(
    id: number,
    user_firstname: string,
    user_lastname: string,
    billing_phone: string,
  ): Promise<ICustomer> {
    try {
      const params = {
        id: id,
        user_firstname: user_firstname,
        user_lastname: user_lastname,
        billing_phone: billing_phone,
      };
      return await this.HelperService.postRequestData(
        'update-customer',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  async updateCustomerSocialProfile(
    UpdateCustomerSocialDto: UpdateCustomerSocialDto,
  ): Promise<ICustomer> {
    try {
      return await this.HelperService.postRequestData(
        'update-customer-social',
        UpdateCustomerSocialDto,
      );
    } catch (err) {
      return null;
    }
  }

  async updateCustomerPassword(
    id: number,
    password: string,
    new_password: string,
  ): Promise<any> {
    try {
      const params = { id: id, password: password, new_password: new_password };
      return await this.HelperService.postRequestData(
        'change-password',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  async resetCustomerPassword(
    email: string,
  ): Promise<any> {
    try {
      const params = { user_login: email };
      return await this.HelperService.postRequestData(
        'reset-password',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  async setDefaultBillingMethod(
    card_id: number,
    user_id: number,
  ): Promise<any> {
    try {
      const params = { card_id: card_id, user_id: user_id };
      return await this.HelperService.postRequestData(
        'default-billing-method',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  async deleteBillingMethod(
    card_id: number,
    user_id: number,
  ): Promise<any> {
    try {
      const params = { card_id: card_id, user_id: user_id };
      return await this.HelperService.postRequestData(
        'delete-billing-method',
        params,
      );
    } catch (err) {
      return null;
    }
  }

  async removeCustomer(id: number) {
    try {
      return this.customerModel.findOneAndDelete({ id: id }).exec();
    } catch (error) {
      // Handle error
      return null;
    }
  }

  async findDuplicateIds(): Promise<string[]> {
    const pipeline = [
      {
        $group: {
          _id: '$id',
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ];

    const duplicateIds = await this.customerModel.aggregate(pipeline);

    return duplicateIds.map((duplicate) => duplicate._id.toString());
  }

  async findAndRemoveDuplicates(): Promise<string[]> {
    const pipeline = [
      {
        $group: {
          _id: { id: '$id' }, // Specify the fields for checking duplicates
          count: { $sum: 1 },
          duplicates: { $addToSet: '$_id' }, // Store the IDs of duplicate documents
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ];

    const duplicateGroups = await this.customerModel.aggregate(pipeline).exec();

    for (const group of duplicateGroups) {
      // Keep the first document (ID) and remove the rest of elements
      const [firstDocument, ...restDocuments] = group.duplicates;

      await this.customerModel.deleteMany({ _id: { $in: restDocuments } });
    }
    return duplicateGroups;
  }
  
}
