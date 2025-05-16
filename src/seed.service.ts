import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea/aerolinea.entity';
import { AeropuertoEntity } from './aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepo: Repository<AerolineaEntity>,
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepo: Repository<AeropuertoEntity>,
  ) {}

  async onModuleInit() {
    // Seed Aeropuertos con UUID fijo
    const aeropuerto1 = this.aeropuertoRepo.create({
      id: '11111111-1111-1111-1111-111111111111',
      nombre: 'El Dorado',
      codigo: 'BOG',
      pais: 'Colombia',
      ciudad: 'Bogotá',
    });
    const aeropuerto2 = this.aeropuertoRepo.create({
      id: '22222222-2222-2222-2222-222222222222',
      nombre: 'Jose Maria Cordoba',
      codigo: 'MDE',
      pais: 'Colombia',
      ciudad: 'Medellín',
    });
    const aeropuerto3 = this.aeropuertoRepo.create({
      id: '33333333-3333-3333-3333-333333333333',
      nombre: 'Rafael Núñez',
      codigo: 'CTG',
      pais: 'Colombia',
      ciudad: 'Cartagena',
    });
    await this.aeropuertoRepo.save([aeropuerto1, aeropuerto2, aeropuerto3]);

    // Seed Aerolineas con UUID fijo
    const aerolinea1 = this.aerolineaRepo.create({
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      nombre: 'Viva Air',
      descripcion: 'Aerolínea colombiana',
      fechaFundacion: '2019-12-05',
      paginaWeb: 'www.vivaair.com',
    });
    const aerolinea2 = this.aerolineaRepo.create({
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      nombre: 'LATAM',
      descripcion: 'Aerolínea latinoamericana',
      fechaFundacion: '2000-01-01',
      paginaWeb: 'www.latam.com',
    });
    await this.aerolineaRepo.save([aerolinea1, aerolinea2]);
  }
}
