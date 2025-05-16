import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, UseInterceptors } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AeropuertoDto } from './aeropuerto.dto';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from './aeropuerto.entity';

@Controller('aeropuertos')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
    constructor(private readonly aeropuertoService: AeropuertoService) {}

    @Get()
    async findAll() {
        return this.aeropuertoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.aeropuertoService.findOne(id);
    }

    @Post()
    async create(@Body() aeropuertoDto: AeropuertoDto) {
        const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
        return await this.aeropuertoService.create(aeropuerto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() aeropuertoDto: AeropuertoDto) {
        const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
        aeropuerto.id = id;
        return await this.aeropuertoService.update(id, aeropuerto);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return this.aeropuertoService.delete(id);
    }
}
