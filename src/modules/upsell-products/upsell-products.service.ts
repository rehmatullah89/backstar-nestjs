import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUpsellProductDto } from './dto/create-upsell-product.dto';
import { UpdateUpsellProductDto } from './dto/update-upsell-product.dto';
import { UpsellProduct } from './schema/upsell-products.schema';
import { ProductSchema, Products } from '../products/schemas/products.schemas';
import { Types } from 'mongoose';
@Injectable()
export class UpsellProductsService {
  constructor(
    @InjectModel(UpsellProduct.name)
    private readonly upsellProductModel: Model<UpsellProduct>,
    @InjectModel(Products.name) private readonly productsModel: Model<Products>,
  ) {}
  async create(createUpsellProductsDto: CreateUpsellProductDto[]) {
    const createdUpsellProducts = await Promise.all(
      createUpsellProductsDto.map(async (dto) => {
        // console.log('dto', dto)
        try {
          // Find the matching product in the Products collection based on the provided id
          const productDocument = await this.productsModel
            .findOne({ id: dto.id })
            .select('_id');

          if (!productDocument) {
            console.error(`No matching product found for id: ${dto.id}`);
            return null;
          }
          const productRefs = await Promise.all(
            dto.products.map(async (productId) => {
              const associatedProduct = await this.productsModel
                .findOne({ id: productId })
                .select('_id');
              return associatedProduct
                ? { id: productId, product: associatedProduct._id }
                : null;
            }),
          );
          const filteredProducts = productRefs.filter((item) => item !== null);
          const uniqueFilteredProducts = [
            ...new Set(
              filteredProducts.map((product) => JSON.stringify(product)),
            ),
          ].map((product) => JSON.parse(product));
          // console.log('uniqueFilteredProducts',uniqueFilteredProducts)
          // Create the UpsellProduct instance with the associated product ref
          // console.log('create', {...dto, products: filteredProducts,
          //   product: productDocument._id,})
          const upsellProduct = await this.upsellProductModel.create({
            ...dto,
            products: filteredProducts,
            product: productDocument._id,
          });

          // Update the created UpsellProduct with the modified products array
          // upsellProduct.products = dto.products;

          await upsellProduct.save();

          return upsellProduct;
        } catch (error) {
          console.error('Error creating UpsellProduct:', error.message);
          // Handle the error appropriately, you might want to throw or return a specific response
          return null;
        }
      }),
    );

    return createdUpsellProducts.filter(Boolean); // Filter out null values if there were errors
  }

  async findObjectsByProductIds(productIds: string[]): Promise<any[]> {
    // const mockIds = [ '794933', '794935', '794937', '813838' ]
    // console.log('productIds',productIds)
    // his will only work correctly if there are no duplicate values in the products.id array of your documents
    const result = await this.upsellProductModel.aggregate([
      {
        $match: {
          'products.id': { $in: productIds },
        },
      },
      {
        $lookup: {
          from: 'products', // replace with your products collection name
          localField: 'product',
          foreignField: '_id',
          as: 'product',
          pipeline: [
            {
              $project: {
                price: 1,
                id: 1,
                image_url: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'products', // replace with your products collection name
          localField: 'products.product',
          foreignField: '_id',
          as: 'products',
          pipeline: [
            {
              $project: {
                price: 1,
                id: 1,
              },
            },
          ],
        },
      },
      // If you dont want to keep the documents in the pipeline if “product” is an empty array, you can use just  $unwind: { path: "$product" }
      {
        $unwind: { path: '$product', preserveNullAndEmptyArrays: true }, // $unwind Deconstructs the product array
      },
      {
        $project: {
          matchedProducts: 0,
          'product._id': 0,
          'products.product._id': 0,
        },
      },
    ]);

    // .populate([{path:'product',select:'price'},{path:'products.product',select:'price'}])

    return result;
  }

  async findAll(): Promise<UpsellProduct[]> {
    return this.upsellProductModel
      .find()
      .populate([
        { path: 'product', select: 'price' },
        { path: 'products.product', select: 'price' },
      ])
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} upsellProduct`;
  }

  update(id: number, updateUpsellProductDto: UpdateUpsellProductDto) {
    return updateUpsellProductDto;
    return `This action updates a #${id} upsellProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} upsellProduct`;
  }
  async clear(): Promise<void> {
    try {
      // Use your mongoose model to remove all documents from the collection
      await this.upsellProductModel.deleteMany({});
    } catch (error) {
      // Handle any errors that might occur during the clearing process
      throw new BadRequestException(
        `Error clearing upsell products: ${error.message}`,
      );
    }
  }
}
// async findObjectsByProductIds(productIds: string[]): Promise<any[]> {

//   // const mockIds = [ '794933', '794935', '794937', '813838' ]
//   // console.log('productIds',productIds)
//   // his will only work correctly if there are no duplicate values in the products.id array of your documents
//   const result = await this.upsellProductModel.aggregate([
//     {
//       $addFields: {
//         matchedProducts: {
//           $setIntersection: ["$products.id", productIds]
//         }
//       }
//     },
//     {
//       $match: {
//         $expr: {
//           $eq: [
//             { $size: "$matchedProducts" },
//             { $size: "$products.id" }
//           ]
//         }
//       }
//     },
//     {
//       $lookup: {
//         from: "products", // replace with your products collection name
//         localField: "product",
//         foreignField: "_id",
//         as: "product",
//         pipeline: [
//           {
//             $project: {
//               price: 1,
//               id: 1
//             }
//           }
//         ]
//       }
//     },
//     {
//       $lookup: {
//         from: "products", // replace with your products collection name
//         localField: "products.product",
//         foreignField: "_id",
//         as: "products",
//         pipeline: [
//           {
//             $project: {
//               price: 1,
//               id: 1
//             }
//           }
//         ]
//       }
//     },
//     // If you dont want to keep the documents in the pipeline if “product” is an empty array, you can use just  $unwind: { path: "$product" }
//     {
//       $unwind: { path: "$product", preserveNullAndEmptyArrays: true } // $unwind Deconstructs the product array
//     },
//     {
//       $project: {
//         matchedProducts: 0,
//         "product._id": 0,
//         "products.product._id": 0
//       }
//     }
//   ])
//   // .populate([{path:'product',select:'price'},{path:'products.product',select:'price'}])

//   return result;
// }
