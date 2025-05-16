import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AerolineaAeropuertoService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
    ) {}

    async addAirportToAirline(aerolineaId: string, aeropuertoId: string): Promise<void> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea)
            throw new BusinessLogicException('La aerolínea con el id proporcionado no existe', BusinessError.NOT_FOUND);

        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId } });
        if (!aeropuerto)
            throw new BusinessLogicException('El aeropuerto con el id proporcionado no existe', BusinessError.NOT_FOUND);

        if (!aerolinea.aeropuertos) aerolinea.aeropuertos = [];
        aerolinea.aeropuertos.push(aeropuerto);
        await this.aerolineaRepository.save(aerolinea);
    }

    async findAirportsFromAirline(aerolineaId: string): Promise<AeropuertoEntity[]> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea)
            throw new BusinessLogicException('La aerolínea con el id proporcionado no existe', BusinessError.NOT_FOUND);
        return aerolinea.aeropuertos;
    }

    async findAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<AeropuertoEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea)
            throw new BusinessLogicException('La aerolínea con el id proporcionado no existe', BusinessError.NOT_FOUND);

        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId } });
        if (!aeropuerto)
            throw new BusinessLogicException('El aeropuerto con el id proporcionado no existe', BusinessError.NOT_FOUND);

        const found = aerolinea.aeropuertos.find(a => a.id === aeropuerto.id);
        if (!found)
            throw new BusinessLogicException('El aeropuerto no está asociado a la aerolínea', BusinessError.NOT_FOUND);

        return found;
    }

    async updateAirportsFromAirline(aerolineaId: string, aeropuertos: AeropuertoEntity[]): Promise<void> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea)
            throw new BusinessLogicException('La aerolínea con el id proporcionado no existe', BusinessError.PRECONDITION_FAILED);

        for (const aeropuerto of aeropuertos) {
            const found = await this.aeropuertoRepository.findOne({ where: { id: aeropuerto.id } });
            if (!found)
                throw new BusinessLogicException('El aeropuerto con el id proporcionado no existe', BusinessError.NOT_FOUND);
        }
        aerolinea.aeropuertos = aeropuertos;
        await this.aerolineaRepository.save(aerolinea);
    }

    async deleteAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<void> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea)
            throw new BusinessLogicException('La aerolínea con el id proporcionado no existe', BusinessError.PRECONDITION_FAILED);

        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId } });
        if (!aeropuerto)
            throw new BusinessLogicException('El aeropuerto con el id proporcionado no existe', BusinessError.PRECONDITION_FAILED);

        aerolinea.aeropuertos = aerolinea.aeropuertos.filter(a => a.id !== aeropuerto.id);
        await this.aerolineaRepository.save(aerolinea);
    }
}
