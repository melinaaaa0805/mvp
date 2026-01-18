import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('OrdersController (security)', () => {
  let controller: OrdersController;
  let ordersService: jest.Mocked<OrdersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            getOrdersByUser: jest.fn(),
            getAllOrders: jest.fn(),
            updateOrder: jest.fn(),
            deleteOrder: jest.fn(),
            createOrder: jest.fn(),
          },
        },
      ],
    })
      // On remplace le JwtAuthGuard par un faux guard qui simule un utilisateur déjà authentifié.
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { userId: 'user-1', role: 'USER' };
          return true;
        },
      })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be protected by JwtAuthGuard at controller level', () => {
    const guards = Reflect.getMetadata('__guards__', OrdersController) || [];
    const guardInstances = guards.map((g: any) => new g());

    const hasJwtGuard = guardInstances.some(
      (guard) => guard instanceof JwtAuthGuard,
    );

    expect(hasJwtGuard).toBe(true);
  });

  it('getMyOrders should use userId from JWT payload', async () => {
    const req = { user: { userId: 'user-123' } } as any;

    await controller.getMyOrders(req);

    expect(ordersService.getOrdersByUser).toHaveBeenCalledWith('user-123');
  });

  it('createOrder should use userId from JWT payload', async () => {
    const req = { user: { userId: 'user-456' } } as any;
    const body = { title: 'Test', amount: 10 } as any;

    await controller.createOrder(req, body);

    expect(ordersService.createOrder).toHaveBeenCalledWith('user-456', body);
  });
});
