import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AerolineaService {
    constructor(
       @InjectRepository(AerolineaEntity)
       private readonly aerolineaRepository: Repository<AerolineaEntity>
   ){}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find();
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id } });
        if (!aerolinea)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        if (!this.isFechaFundacionValida(aerolinea.fechaFundacion))
            throw new BusinessLogicException("The foundation date must be in the past", BusinessError.PRECONDITION_FAILED);
        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedAerolinea = await this.aerolineaRepository.findOne({ where: { id } });
        if (!persistedAerolinea)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        if (!this.isFechaFundacionValida(aerolinea.fechaFundacion))
            throw new BusinessLogicException("The foundation date must be in the past", BusinessError.PRECONDITION_FAILED);
        return await this.aerolineaRepository.save({ ...persistedAerolinea, ...aerolinea });
    }

    async delete(id: string) {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id } });
        if (!aerolinea)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        await this.aerolineaRepository.remove(aerolinea);
    }

    private isFechaFundacionValida(fechaFundacion: Date): boolean {
        if (!fechaFundacion) return false;
        const now = new Date();
        return fechaFundacion < now;
    }
}
