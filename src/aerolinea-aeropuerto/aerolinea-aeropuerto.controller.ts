import { Controller, Post, Get, Put, Delete, Param, Body, HttpCode, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AeropuertoDto } from '../aeropuerto/aeropuerto.dto';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

@Controller('aerolineas')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService) {}

    @Post(':aerolineaId/aeropuertos/:aeropuertoId')
    async addAirportToAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.addAirportToAirline(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/aeropuertos')
    async findAirportsFromAirline(@Param('aerolineaId') aerolineaId: string) {
        return await this.aerolineaAeropuertoService.findAirportsFromAirline(aerolineaId);
    }

    @Get(':aerolineaId/aeropuertos/:aeropuertoId')
    async findAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.findAirportFromAirline(aerolineaId, aeropuertoId);
    }

    @Put(':aerolineaId/aeropuertos')
    async updateAirportsFromAirline(@Param('aerolineaId') aerolineaId: string, @Body() aeropuertoDtos: AeropuertoDto[]) {
        const aeropuertos: AeropuertoEntity[] = plainToInstance(AeropuertoEntity, aeropuertoDtos);
        return await this.aerolineaAeropuertoService.updateAirportsFromAirline(aerolineaId, aeropuertos);
    }

    @Delete(':aerolineaId/aeropuertos/:aeropuertoId')
    @HttpCode(204)
    async deleteAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.deleteAirportFromAirline(aerolineaId, aeropuertoId);
    }
}
