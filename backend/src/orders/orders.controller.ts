import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { UpdateOrderAdminDto } from './dto/update-order-admin.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // =======================
  // USER
  // =======================
  @Get()
  getMyOrders(@Req() req: Request) {
    const userId = (req.user as { userId: string }).userId;
    return this.ordersService.getOrdersByUser(userId);
  }

  @Post()
  createOrder(@Req() req: Request, @Body() body: CreateOrderDto) {
    const userId = (req.user as { userId: string }).userId;
    return this.ordersService.createOrder(userId, body);
  }

  // =======================
  // ADMIN
  // =======================
  @Get('admin')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Patch(':id')
  updateOrderAdmin(
    @Param('id') idOrder: string,
    @Body() body: UpdateOrderAdminDto,
  ) {
    return this.ordersService.updateOrder(idOrder, body);
  }

  @Delete(':id')
  deleteOrderAdmin(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
