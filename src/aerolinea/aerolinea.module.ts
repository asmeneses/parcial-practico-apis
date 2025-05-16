import { Module } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AerolineaEntity])],
    providers: [AerolineaService],
    exports: [AerolineaService],
    controllers: [],
})
export class AerolineaModule {}
