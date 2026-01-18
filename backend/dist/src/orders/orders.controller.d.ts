import { OrdersService } from './orders.service';
import { UpdateOrderAdminDto } from './dto/update-order-admin.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getMyOrders(req: any): Promise<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        amount: number;
        userId: string;
        createdAt: Date;
    }[]>;
    getAllOrders(): Promise<({
        user: {
            email: string;
        };
    } & {
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        amount: number;
        userId: string;
        createdAt: Date;
    })[]>;
    updateOrderAdmin(idOrder: string, body: UpdateOrderAdminDto): Promise<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        amount: number;
        userId: string;
        createdAt: Date;
    }>;
    deleteOrderAdmin(id: string): import(".prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        amount: number;
        userId: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createOrder(req: any, body: any): Promise<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        amount: number;
        userId: string;
        createdAt: Date;
    }>;
}
