import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, UseInterceptors } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaDto } from './aerolinea.dto';
import { plainToInstance } from 'class-transformer';
import { AerolineaEntity } from './aerolinea.entity';

@Controller('aerolineas')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService) {}

    @Get()
    async findAll() {
        return this.aerolineaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.aerolineaService.findOne(id);
    }

    @Post()
    async create(@Body() aerolineaDto: AerolineaDto) {
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
        return await this.aerolineaService.create(aerolinea);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() aerolineaDto: AerolineaDto) {
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
        return await this.aerolineaService.update(id, aerolinea);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return this.aerolineaService.delete(id);
    }
}
