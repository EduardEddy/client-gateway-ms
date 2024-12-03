import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, OrderPaginationDTO, StatusDTO } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDTO } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDTO) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'findAllOrders' }, orderPaginationDto)
      );
    } catch (error) {
      throw new RpcException(error);
    }

  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id: id }));
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(@Param() status: StatusDTO, @Query() paginationDto: PaginationDTO) {
    try {
      return this.client.send('findAllOrders', {
        ...paginationDto,
        status: status.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() statusDTO: StatusDTO) {
    try {
      const order = await firstValueFrom(
        this.client.send('changeOrderStatus', { id, status: statusDTO.status })
      );

      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
