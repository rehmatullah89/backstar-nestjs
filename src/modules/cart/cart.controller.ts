import {
  Controller,
  Get,
  Post,
  Body,

  Param,
  Res,
  UseGuards,
  HttpStatus,
  UseFilters
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '../auth/auth.guard';
// import { AllExceptionFilter } from 'src/exceptions/all-exception.filter';
import { Types } from 'mongoose';
import { response } from 'express';

@ApiTags('Cart')
@Controller('cart')
// @UseFilters(AllExceptionFilter)
export class CartController {
  constructor(private readonly cartService: CartService) { }
  //@UseGuards(AuthGuard)
  @Post('sync')
  async syncCart(@Res() response, @Body() createCartDto: CreateCartDto) {
    try {

      const cart = await this.cartService.updateOrCreate(createCartDto);
     
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        success: cart ? true : false,
        message: cart ? 'Cart synced successfully' : 'Failed to sync cart!',
        data: cart,
      })
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Failed to sync cart!',
        error: 'Bad Request',
      })
    }

  }
  @Get('clear/:device_id')
  async emptyCart(@Res() response, @Param('device_id') device_id: string | number) {

    try {
      const cart = await this.cartService.clearCartByDeviceId(device_id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        success: cart ? true : false,
        message: cart ? 'Cart cleared successfully' : 'Cart not found!',
        data: cart,
      })
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Failed to clear cart!',
        error: 'Bad Request',
      })
    }

  }
  @UseGuards(AuthGuard)
  @Get(':device_id')
  async findByUserId(@Res() response, @Param('device_id') device_id: number | string) {
    try {

      const cart = await this.cartService.findByDeviceId(device_id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        success: cart ? true : false,
        message: cart ? 'Cart fetched successfully' : 'Cart not found!',
        data: cart,
      })
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Failed to get cart!',
        error: 'Bad Request',
      })
    }

  }

  @UseGuards(AuthGuard)
  @Post('add-to-cart')
  async addTocart(@Res() response,@Body() data:{id:string|number,device_id:string,quantity:number}){
    const product_id = data.id;
    const device_id = data.device_id;
    
    try{

      const product = await this.cartService.addToCart(product_id,device_id,data.quantity)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        success:product,
        message: 'Product added to cart successfully',
        data: product,
      })
    }catch(err){

    }
    // return this.cartService.addToCart(item);
  }


}
