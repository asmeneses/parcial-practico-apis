import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ) {}

    async findAll(): Promise<AeropuertoEntity[]> {
        return await this.aeropuertoRepository.find();
    }

    async findOne(id: string): Promise<AeropuertoEntity> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id } });
        if (!aeropuerto)
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
        return aeropuerto;
    }

    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        // Validar nombre único
        const existing = await this.aeropuertoRepository.findOne({ where: { nombre: aeropuerto.nombre } });
        if (existing)
            throw new BusinessLogicException("An airport with the given name already exists", BusinessError.PRECONDITION_FAILED);

        if (!this.isCodigoValido(aeropuerto.codigo))
            throw new BusinessLogicException("The airport code must have exactly three characters", BusinessError.PRECONDITION_FAILED);
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const persistedAeropuerto = await this.aeropuertoRepository.findOne({ where: { id } });
        if (!persistedAeropuerto)
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
        if (!this.isCodigoValido(aeropuerto.codigo))
            throw new BusinessLogicException("The airport code must have exactly three characters", BusinessError.PRECONDITION_FAILED);
        return await this.aeropuertoRepository.save({ ...persistedAeropuerto, ...aeropuerto });
    }

    async delete(id: string) {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id } });
        if (!aeropuerto)
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
        await this.aeropuertoRepository.remove(aeropuerto);
    }

    private isCodigoValido(codigo: string): boolean {
        return typeof codigo === 'string' && codigo.length === 3;
    }
}
