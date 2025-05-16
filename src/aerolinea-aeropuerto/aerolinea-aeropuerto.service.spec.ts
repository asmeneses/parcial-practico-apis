import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepo: Repository<AerolineaEntity>;
  let aeropuertoRepo: Repository<AeropuertoEntity>;

  const aeropuerto: AeropuertoEntity = { id: '1', nombre: 'A1', codigo: 'ABC', pais: 'CO', ciudad: 'Bogotá', aerolineas: [] };
  const aeropuerto2: AeropuertoEntity = { id: '2', nombre: 'A2', codigo: 'DEF', pais: 'CO', ciudad: 'Medellín', aerolineas: [] };
  const aerolinea: AerolineaEntity = {
    id: '1',
    nombre: 'Air1',
    descripcion: 'desc',
    fechaFundacion: '2000-01-01',
    paginaWeb: 'web',
    aeropuertos: [aeropuerto]
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AerolineaAeropuertoService,
        {
          provide: getRepositoryToken(AerolineaEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AeropuertoEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepo = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepo = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
  });

  describe('addAirportToAirline', () => {
    it('should add an airport to an airline', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue({ ...aerolinea, aeropuertos: [] } as any);
      jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuerto as any);
      jest.spyOn(aerolineaRepo, 'save').mockResolvedValue({} as any);

      await expect(service.addAirportToAirline('1', '1')).resolves.toBeUndefined();
    });

    it('should initialize aeropuertos if undefined and add airport', async () => {
      const aerolineaSinAeropuertos = { ...aerolinea, aeropuertos: undefined };
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolineaSinAeropuertos as any);
      jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuerto as any);
      const saveSpy = jest.spyOn(aerolineaRepo, 'save').mockResolvedValue({} as any);

      await expect(service.addAirportToAirline('1', '1')).resolves.toBeUndefined();
      expect(saveSpy).toHaveBeenCalledWith({
        ...aerolineaSinAeropuertos,
        aeropuertos: [aeropuerto]
      });
    });

    it('should throw if airline not found', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(null);
      await expect(service.addAirportToAirline('999', '1')).rejects.toEqual(
        expect.objectContaining({ message: 'La aerolínea con el id proporcionado no existe' })
      );
    });

    it('should throw if airport not found', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue({ ...aerolinea, aeropuertos: [] } as any);
      jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(null);
      await expect(service.addAirportToAirline('1', '999')).rejects.toEqual(
        expect.objectContaining({ message: 'El aeropuerto con el id proporcionado no existe' })
      );
    });
  });

  describe('findAirportsFromAirline', () => {
    it('should return airports from an airline', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolinea as any);
      const result = await service.findAirportsFromAirline('1');
      expect(result).toEqual(aerolinea.aeropuertos);
    });

    it('should throw if airline not found', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findAirportsFromAirline('999')).rejects.toEqual(
        expect.objectContaining({ message: 'La aerolínea con el id proporcionado no existe' })
      );
    });
  });

  describe('findAirportFromAirline', () => {
    it('should return an airport from an airline', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolinea as any);
      jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuerto as any);
      const result = await service.findAirportFromAirline('1', '1');
      expect(result).toEqual(aeropuerto);
    });

    it('should throw if airline not found', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findAirportFromAirline('999', '1')).rejects.toEqual(
        expect.objectContaining({ message: 'La aerolínea con el id proporcionado no existe' })
      );
    });

    it('should throw if airport not found', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolinea as any);
      jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findAirportFromAirline('1', '999')).rejects.toEqual(
        expect.objectContaining({ message: 'El aeropuerto con el id proporcionado no existe' })
      );
    });

    it('should throw if airport is not associated', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue({ ...aerolinea, aeropuertos: [] } as any);
      jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuerto as any);
      await expect(service.findAirportFromAirline('1', '1')).rejects.toEqual(
        expect.objectContaining({ message: 'El aeropuerto no está asociado a la aerolínea' })
      );
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('should update airports from an airline', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolinea as any);
      jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuerto as any);
      jest.spyOn(aerolineaRepo, 'save').mockResolvedValue({} as any);
      await expect(service.updateAirportsFromAirline('1', [aeropuerto])).resolves.toBeUndefined();
    });

    it('should throw if airline not found', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(null);
      await expect(service.updateAirportsFromAirline('999', [aeropuerto])).rejects.toEqual(
        expect.objectContaining({ message: 'La aerolínea con el id proporcionado no existe' })
      );
    });

    it('should throw if any airport not found', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolinea as any);
      jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.updateAirportsFromAirline('1', [aeropuerto])).rejects.toEqual(
        expect.objectContaining({ message: 'El aeropuerto con el id proporcionado no existe' })
      );
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('should delete an airport from an airline', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolinea as any);
      jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuerto as any);
      jest.spyOn(aerolineaRepo, 'save').mockResolvedValue({} as any);
      await expect(service.deleteAirportFromAirline('1', '1')).resolves.toBeUndefined();
    });

    it('should throw if airline not found', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(null);
      await expect(service.deleteAirportFromAirline('999', '1')).rejects.toEqual(
        expect.objectContaining({ message: 'La aerolínea con el id proporcionado no existe' })
      );
    });

    it('should throw if airport not found', async () => {
      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolinea as any);
      jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(null);
      await expect(service.deleteAirportFromAirline('1', '999')).rejects.toEqual(
        expect.objectContaining({ message: 'El aeropuerto con el id proporcionado no existe' })
      );
    });

    it('should throw BusinessLogicException when deleting an airport not associated to the airline', async () => {
      // Aerolínea con lista vacía de aeropuertos
      const aerolineaNoAsociada = {
        id: '3',
        nombre: 'Air3',
        descripcion: 'desc3',
        fechaFundacion: '2010-01-01',
        paginaWeb: 'web3',
        aeropuertos: [], // array vacío
      };
      // Aeropuerto existente pero NO asociado
      const aeropuertoNoAsociado = {
        id: '3',
        nombre: 'A3',
        codigo: 'GHI',
        pais: 'CO',
        ciudad: 'Cali',
        aerolineas: [],
      };

      jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolineaNoAsociada as any);
      jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuertoNoAsociado as any);

      await expect(
        service.deleteAirportFromAirline(aerolineaNoAsociada.id, aeropuertoNoAsociado.id)
      ).rejects.toMatchObject({ message: 'El aeropuerto no está asociado a la aerolínea' });
    });
  });
});
