import { IsString, IsNotEmpty, Length } from 'class-validator';

export class AeropuertoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  readonly codigo: string;

  @IsString()
  @IsNotEmpty()
  readonly pais: string;

  @IsString()
  @IsNotEmpty()
  readonly ciudad: string;
}
