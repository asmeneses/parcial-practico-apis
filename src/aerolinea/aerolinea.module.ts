import { Module } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaController } from './aerolinea.controller';

@Module({
    imports: [TypeOrmModule.forFeature([AerolineaEntity])],
    providers: [AerolineaService],
    exports: [AerolineaService],
    controllers: [AerolineaController],
})
export class AerolineaModule {}
