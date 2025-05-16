import { Module } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoController } from './aeropuerto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AeropuertoEntity])],
  providers: [AeropuertoService],
  controllers: [AeropuertoController],
  exports: [AeropuertoService],
})
export class AeropuertoModule {}
