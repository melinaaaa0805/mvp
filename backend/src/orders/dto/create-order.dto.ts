import { IsString, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  title: string;

  @IsNumber()
  amount: number;

  @IsString()
  userId: string;
}
