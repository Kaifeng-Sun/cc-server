import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CartItemService } from "./cartItem.service";
import { CreateCartItemDto } from "./dto/create-cartItem.dto";
import { FindCartItemListByAdminDto, FindAllCartItemDto } from "./dto/findAll-cartItem.dto";
import { UpdateCartItemDto } from "./dto/update-cartItem.dto";
import { CartItem } from "./schemas/cartItem.schema";
import { ObjectId } from "mongoose";
import { PaginationQueryDto } from "src/utils/PaginationDto/pagination-query.dto";

@Controller("shopping-cart")
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}
  @Get()
  async findAll(@Query() findAllCartItem: FindAllCartItemDto): Promise<CartItem[]> {
    return await this.cartItemService.findAll(findAllCartItem);
  }

  @Get("/admin")
  async findCartItemListByAdmin(
    @Query() findCartItemListByAdmin: PaginationQueryDto & FindCartItemListByAdminDto,
  ): Promise<{
    data: CartItem[];
    total: number;
  }> {
    return await this.cartItemService.findCartItemListByAdmin(findCartItemListByAdmin);
  }

  @Get(":id")
  async findOne(@Param("id") id: ObjectId): Promise<CartItem> {
    return await this.cartItemService.findOne(id);
  }

  @Post()
  async create(@Body() createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    return await this.cartItemService.create(createCartItemDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: ObjectId,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    return await this.cartItemService.update(id, updateCartItemDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: ObjectId): Promise<boolean> {
    return await this.cartItemService.remove(id);
  }
}
