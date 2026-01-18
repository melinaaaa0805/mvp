import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrdersByUser(userId: string): Promise<{
        id: string;
        title: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        amount: number;
        userId: string;
        createdAt: Date;
    }[]>;
    createOrder(userId: string, data: {
        title: string;
        amount: number;
    }): Promise<{
        id: string;
        title: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        amount: number;
        userId: string;
        createdAt: Date;
    }>;
    updateOrder(orderId: string, data: {
        title?: string;
        amount?: number;
    }): Promise<{
        id: string;
        title: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        amount: number;
        userId: string;
        createdAt: Date;
    }>;
    getAllOrders(): Promise<({
        user: {
            email: string;
        };
    } & {
        id: string;
        title: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        amount: number;
        userId: string;
        createdAt: Date;
    })[]>;
    deleteOrder(id: string): import("@prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        title: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        amount: number;
        userId: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
