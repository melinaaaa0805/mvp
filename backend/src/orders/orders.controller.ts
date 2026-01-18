// src/orders/orders.controller.ts
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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { UpdateOrderAdminDto } from './dto/update-order-admin.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // =======================
  // USER
  // =======================
  @Get()
  getMyOrders(@Req() req) {
    return this.ordersService.getOrdersByUser(req.user.userId);
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
  @Post()
  createOrder(@Req() req, @Body() body) {
    return this.ordersService.createOrder(req.user.userId, body);
  }
}
