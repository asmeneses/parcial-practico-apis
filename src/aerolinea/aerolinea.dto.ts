import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsUrl, Matches } from 'class-validator';

export class AerolineaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fechaFundacion must be in YYYY-MM-DD format' })
  readonly fechaFundacion: string;

  @IsUrl()
  @IsNotEmpty()
  readonly paginaWeb: string;
}
