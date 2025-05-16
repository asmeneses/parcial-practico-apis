import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repo: Repository<AeropuertoEntity>;

  const aeropuertoArray = [
    { id: '1', nombre: 'A1', codigo: 'ABC', pais: 'CO', ciudad: 'Bogotá', aerolineas: [] },
    { id: '2', nombre: 'A2', codigo: 'DEF', pais: 'CO', ciudad: 'Medellín', aerolineas: [] },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AeropuertoService,
        {
          provide: getRepositoryToken(AeropuertoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(aeropuertoArray),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repo = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all airports', async () => {
      const result = await service.findAll();
      expect(result).toEqual(aeropuertoArray);
    });
  });

  describe('findOne', () => {
    it('should return an airport by id', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(aeropuertoArray[0] as any);
      const result = await service.findOne('1');
      expect(result).toEqual(aeropuertoArray[0]);
    });

    it('should throw if airport not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toEqual(
        expect.objectContaining({ message: 'The airport with the given id was not found' })
      );
    });
  });

  describe('create', () => {
    it('should create an airport with valid code', async () => {
      const aeropuerto = { ...aeropuertoArray[0] };
      jest.spyOn(repo, 'save').mockResolvedValue(aeropuerto as any);
      const result = await service.create(aeropuerto as any);
      expect(result).toEqual(aeropuerto);
    });

    it('should throw if code is not 3 chars', async () => {
      const aeropuerto = { ...aeropuertoArray[0], codigo: 'LONG' };
      await expect(service.create(aeropuerto as any)).rejects.toEqual(
        expect.objectContaining({ message: 'The airport code must have exactly three characters' })
      );
    });

    it('should throw if airport name already exists', async () => {
      const aeropuerto = { id: '1', nombre: 'A1', codigo: 'ABC', pais: 'CO', ciudad: 'Bogotá', aerolineas: [] };
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(aeropuerto as any); // Simula que ya existe
      await expect(service.create(aeropuerto as any)).rejects.toEqual(
        expect.objectContaining({ message: 'An airport with the given name already exists' })
      );
    });
  });

  describe('update', () => {
    it('should update an airport with valid code', async () => {
      const aeropuerto = { ...aeropuertoArray[0], nombre: 'Nuevo' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(aeropuertoArray[0] as any);
      jest.spyOn(repo, 'save').mockResolvedValue(aeropuerto as any);
      const result = await service.update('1', aeropuerto as any);
      expect(result).toEqual(aeropuerto);
    });

    it('should throw if airport not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update('999', aeropuertoArray[0] as any)).rejects.toEqual(
        expect.objectContaining({ message: 'The airport with the given id was not found' })
      );
    });

    it('should throw if code is not 3 chars', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(aeropuertoArray[0] as any);
      const aeropuerto = { ...aeropuertoArray[0], codigo: 'LONG' };
      await expect(service.update('1', aeropuerto as any)).rejects.toEqual(
        expect.objectContaining({ message: 'The airport code must have exactly three characters' })
      );
    });
  });

  describe('delete', () => {
    it('should delete an airport', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(aeropuertoArray[0] as any);
      jest.spyOn(repo, 'remove').mockResolvedValue({} as any);
      await expect(service.delete('1')).resolves.toBeUndefined();
    });

    it('should throw if airport not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.delete('999')).rejects.toEqual(
        expect.objectContaining({ message: 'The airport with the given id was not found' })
      );
    });
  });
});
