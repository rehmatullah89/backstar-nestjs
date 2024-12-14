import { Inject, Injectable,Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, CartItem } from './schemas/cart.schema';
import { Products } from '../products/schemas/products.schemas';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  
  constructor(
  
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(CartItem.name) private readonly cartItemModel: Model<CartItem>,
    @InjectModel(Products.name) private readonly productsModel: Model<Products>,
    @Inject(ProductsService) private readonly productService: ProductsService
  ) {}
  async updateOrCreate(createCartDto: CreateCartDto) {
    const device_id = createCartDto.device_id;
    const items =  createCartDto.cart_items;
    
    const productIds = Object.values(items).map((item)=>{
      return item.product_id;
    })

    const selectedFields = ['id','name','image_url','price','sale_price','regular_price','on_sale']
    const products = await this.productsModel
    .find({ id: { $in: productIds } })
    .select(selectedFields.join(' '))
    .exec();

    const updatedItems = Object.entries(items).map(([key, item]) => {
      const productId = item.product_id;
      const product = products.find(product => product.id === productId);
      const name = product ? product.name : '';
      const image_url = product ? product.image_url : '';
      const price = product ? product.price : '0';
      const sale_price = product ? product.sale_price : '0';
      const regular_price = product ? product.regular_price : '0';
      const on_sale = product ? product.on_sale : false;
      const id = product ? product.id : null;
      return { ...item, id,name,image_url,price,sale_price,regular_price,on_sale }; // Add the name property to the cart item
  });
  const updatedItemsObject = updatedItems.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
}, {});

  const updatedCreateCartDto = { ...createCartDto, cart_items: updatedItemsObject  };

  
    
     const cart = await this.cartModel.findOneAndUpdate(
        { device_id },
        updatedCreateCartDto,
        { new: true, upsert: true }
      ).exec();

      return cart;

    
  }
  async clearCartByDeviceId(device_id: string|number) {
    const cart = await this.cartModel.findOneAndUpdate(
      { device_id },
      {
       
        $set: {
          'cart_totals.subtotal': '0',
          'cart_totals.subtotal_tax': 0,
          'cart_totals.shipping_total': '0',
          'cart_totals.shipping_tax': 0,
          'cart_totals.shipping_taxes': [],
          'cart_totals.discount_total': 0,
          'cart_totals.discount_tax': 0,
          'cart_totals.cart_contents_total': '0',
          'cart_totals.cart_contents_tax': 0,
          'cart_totals.cart_contents_taxes': new Map(),
          'cart_totals.fee_total': '0',
          'cart_totals.fee_tax': 0,
          'cart_totals.fee_taxes': [],
          'cart_totals.total': '0',
          'cart_totals.total_tax': 0,
          'cart_totals.coupons': [],
          'cart_items':[]
        }
      },
      { new: true }
    ).exec();
    return cart;
  }

  async findByDeviceId(device_id: string|number): Promise<Cart | null> {
   
      return this.cartModel.findOne({ device_id: device_id }).exec();
    
  }

  async addToCart(product_id,device_id,quantity){
    
    
    const product =  await this.productService.searchProductById(product_id)
    if(product){
      const {name,price,image_url} = product

        const cart = await this.cartModel.findOne({ device_id: device_id });
        if (!cart) {
          return false;
        }
        //Check if item in cart exists, just update quantity 
        for (const [_, cartItem] of cart.cart_items.entries()) {
          if (cartItem.id === product_id) {
            if(quantity)
            cartItem.quantity += quantity
            else
            cartItem.quantity += 1;

            cart.save();
           return true
          }
        }
        // If not existing add newly
        const cartItem = {
          id: product_id,
          name,
          quantity: quantity ? quantity : 1,
          price,
          image_url
        }
        const newCartItem = new this.cartItemModel(cartItem);
        cart.cart_items.set(newCartItem.id.toString(), newCartItem);
        cart.save()
        return false;
      }


        
      
  }

}



// const cart = await this.findByDeviceId(createCartDto.device_id);
// if (cart) {
  // Cart exists for the user

  // Check if the product_id already exists in the cart
  // createCartDto.items.forEach((newItem) => {
  //   const existingItem = cart.items.find(
  //     (cartItem: CartItem) => cartItem.product_id === newItem.product_id,
  //   );

  //   if (existingItem) {
  //     // Product exists in the cart, increase quantity
  //     existingItem.product_quantity += newItem.product_quantity;
  //   } else {
  //     // Product does not exist in the cart, add it
  //     cart.items.push(newItem);
  //   }
  // });

  // Recalculate total
  // cart.total = cart.items.reduce(
  //   (total, item) => total + item.product_quantity * item.product_price,
  //   0,
  // );

  // Save the updated cart
  // return cart.save();
// } else {
  // Cart does not exist for the user, create a new one
  // const createdCart = new this.cartModel({
  //   user_id: createCartDto.user_id,
  //   items: createCartDto.items,
  //   total: createCartDto.total,
  // });

  // return createdCart.save();
// }




//FOR CART
// const cart = await this.findByDeviceId(createCartDto.device_id);
//     if (cart) {
//       // Cart exists for the user
  
//       // Iterate over keys of cart_items
//       for (const [key, newItem] of Object.entries(createCartDto.cart_items)) {
//         // Check if the product_id already exists in the cart
//         const existingItem = cart.cart_items.get(key);
//         if (existingItem && existingItem.product_id === newItem.product_id) {
//           // Product already exists in the cart, handle accordingly
//           existingItem.quantity += newItem.quantity;
//         }else{
//           cart.cart_items[key] = newItem;
//         }
//       }
//       let subtotal = 0;
//       for (const item of cart.cart_items.values()) {
//         subtotal += item.quantity * item.line_subtotal;
//       }
//       cart.cart_totals.subtotal = subtotal.toString();
//       // cart.save()
//     }