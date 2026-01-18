import { OrderStatus } from '@prisma/client';
export declare class UpdateOrderAdminDto {
    title?: string;
    amount?: number;
    status?: OrderStatus;
}
