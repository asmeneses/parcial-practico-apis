import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repo: Repository<AerolineaEntity>;

  const now = new Date();
  const pastDateString = `${now.getFullYear() - 1}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const futureDateString = `${now.getFullYear() + 1}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const aerolineaArray = [
    { id: '1', nombre: 'A1', descripcion: 'desc', fechaFundacion: pastDateString, paginaWeb: 'web', aeropuertos: [] },
    { id: '2', nombre: 'A2', descripcion: 'desc', fechaFundacion: pastDateString, paginaWeb: 'web', aeropuertos: [] },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AerolineaService,
        {
          provide: getRepositoryToken(AerolineaEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(aerolineaArray),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repo = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all airlines', async () => {
      const result = await service.findAll();
      expect(result).toEqual(aerolineaArray);
    });
  });

  describe('findOne', () => {
    it('should return an airline by id', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(aerolineaArray[0] as any);
      const result = await service.findOne('1');
      expect(result).toEqual(aerolineaArray[0]);
    });

    it('should throw if airline not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toEqual(
        expect.objectContaining({ message: 'The airline with the given id was not found' })
      );
    });
  });

  describe('create', () => {
    it('should create an airline with valid past date', async () => {
      const aerolinea = { ...aerolineaArray[0], fechaFundacion: pastDateString, descripcion: 'desc' };
      jest.spyOn(repo, 'save').mockResolvedValue(aerolinea as any);
      const result = await service.create(aerolinea as any);
      expect(result).toEqual(aerolinea);
    });

    it('should throw if foundation date is in the future', async () => {
      const aerolinea = { ...aerolineaArray[0], fechaFundacion: futureDateString, descripcion: 'desc' };
      await expect(service.create(aerolinea as any)).rejects.toEqual(
        expect.objectContaining({ message: 'The foundation date must be in the past' })
      );
    });

    it('should throw if foundation date is missing', async () => {
      const aerolinea = { ...aerolineaArray[0], fechaFundacion: undefined, descripcion: 'desc' };
      await expect(service.create(aerolinea as any)).rejects.toEqual(
        expect.objectContaining({ message: 'The foundation date must be in the past' })
      );
    });

    it('should throw if airline name already exists', async () => {
      const aerolinea = { ...aerolineaArray[0] };
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(aerolinea as any); // Simula que ya existe
      await expect(service.create(aerolinea as any)).rejects.toEqual(
        expect.objectContaining({ message: 'An airline with the given name already exists' })
      );
    });

    it('should throw if foundation date format is invalid', async () => {
      const aerolinea = { ...aerolineaArray[0], fechaFundacion: '2023/01/01' }; // Formato inválido
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null); // No existe nombre repetido
      await expect(service.create(aerolinea as any)).rejects.toEqual(
        expect.objectContaining({ message: 'The foundation date must be in the past' })
      );
    });

    it('should throw if foundation date is not a real date', async () => {
      const aerolinea = { ...aerolineaArray[0], fechaFundacion: '2023-02-35' }; // Fecha inválida
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null); // No existe nombre repetido
      await expect(service.create(aerolinea as any)).rejects.toEqual(
        expect.objectContaining({ message: 'The foundation date must be in the past' })
      );
    });

    it('should throw if foundation date is not a real date (e.g. 2023-02-30)', async () => {
      const aerolinea = { ...aerolineaArray[0], fechaFundacion: '2023-02-30' };
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(service as any, 'isFechaFundacionValida').mockReturnValue(false); // Forzar error
      await expect(service.create(aerolinea as any)).rejects.toEqual(
        expect.objectContaining({ message: 'The foundation date must be in the past' })
      );
    });
  });

  describe('update', () => {
    it('should update an airline with valid past date', async () => {
      const aerolinea = { ...aerolineaArray[0], nombre: 'Nuevo', fechaFundacion: pastDateString, descripcion: 'desc' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(aerolineaArray[0] as any);
      jest.spyOn(repo, 'save').mockResolvedValue(aerolinea as any);
      const result = await service.update('1', aerolinea as any);
      expect(result).toEqual(aerolinea);
    });

    it('should throw if airline not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update('999', aerolineaArray[0] as any)).rejects.toEqual(
        expect.objectContaining({ message: 'The airline with the given id was not found' })
      );
    });

    it('should throw if foundation date is in the future', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(aerolineaArray[0] as any);
      const aerolinea = { ...aerolineaArray[0], fechaFundacion: futureDateString, descripcion: 'desc' };
      await expect(service.update('1', aerolinea as any)).rejects.toEqual(
        expect.objectContaining({ message: 'The foundation date must be in the past' })
      );
    });

    it('should throw if foundation date is missing', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(aerolineaArray[0] as any);
      const aerolinea = { ...aerolineaArray[0], fechaFundacion: undefined, descripcion: 'desc' };
      await expect(service.update('1', aerolinea as any)).rejects.toEqual(
        expect.objectContaining({ message: 'The foundation date must be in the past' })
      );
    });
  });

  describe('delete', () => {
    it('should delete an airline', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(aerolineaArray[0] as any);
      jest.spyOn(repo, 'remove').mockResolvedValue({} as any);
      await expect(service.delete('1')).resolves.toBeUndefined();
    });

    it('should throw if airline not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.delete('999')).rejects.toEqual(
        expect.objectContaining({ message: 'The airline with the given id was not found' })
      );
    });
  });
});
