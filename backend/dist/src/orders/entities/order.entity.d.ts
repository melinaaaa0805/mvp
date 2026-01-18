import { OrderStatus } from '@prisma/client';
export declare class OrderEntity {
    id: string;
    status: OrderStatus;
    amount: number;
    createdAt: Date;
    constructor(partial: Partial<OrderEntity>);
}
