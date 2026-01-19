// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // USER
  async getOrdersByUser(userId: string) {
    return await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
  async createOrder(userId: string, data: { title: string; amount: number }) {
    return await this.prisma.order.create({
      data: {
        title: data.title,
        amount: data.amount,
        status: OrderStatus.PENDING,
        user: {
          connect: { id: userId },
        },
      },
    });
  }
  async updateOrder(
    orderId: string,
    data: { title?: string; amount?: number },
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException();

    return this.prisma.order.update({
      where: { id: orderId },
      data,
      include: {
        user: {
          select: { email: true },
        },
      },
    });
  }

  // ADMIN
  async getAllOrders() {
    return await this.prisma.order.findMany({
      include: {
        user: {
          select: { email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  deleteOrder(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
