import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDTO } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send(
      { cmd: 'create_product' },
      createProductDto,
    );
  }

  @Get()
  findAllProducts(@Query() paginationDTO: PaginationDTO) {
    return this.client.send(
      { cmd: 'find_all_products' },
      paginationDTO,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.client.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );

    /*try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'find_one_product' }, { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }*/
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'delete_product' }, id).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.client
      .send({ cmd: 'update_product' }, { id, ...body })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
