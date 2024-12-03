import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVICE } from 'src/config';
import { NatsModule } from 'src/nats/nats.module';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    NatsModule
    /*ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers
        },
      }
    ]),*/
  ],
})
export class OrdersModule { }
