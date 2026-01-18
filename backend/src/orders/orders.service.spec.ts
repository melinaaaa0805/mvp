import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService (security)', () => {
  let service: OrdersService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const prismaMock: jest.Mocked<PrismaService> = {
      order: {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('updateOrder should throw NotFoundException when order does not exist', async () => {
    prisma.order.findUnique.mockResolvedValueOnce(null as any);

    await expect(
      service.updateOrder('order-unknown', { title: 'test' }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.order.update).not.toHaveBeenCalled();
  });

  it('getOrdersByUser should filter by userId (no information leak)', async () => {
    prisma.order.findMany.mockResolvedValueOnce([]);

    await service.getOrdersByUser('user-1');

    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: { createdAt: 'desc' },
    });
  });
});
