import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
  IsIn,
  MaxLength,
} from 'class-validator';

export class CreateReporteDto {
  @IsUUID('4', { message: 'El usuario_id debe ser un UUID válido' })
  @IsNotEmpty()
  usuario_id: string;

  @IsNumber({}, { message: 'La latitud debe ser un número (ej. 31.7385)' })
  @IsNotEmpty()
  latitud: number;

  @IsNumber({}, { message: 'La longitud debe ser un número (ej. -106.4850)' })
  @IsNotEmpty()
  longitud: number;

  @IsString()
  @IsIn(['perdido', 'avistado', 'rescatado'], {
    message: 'El estado debe ser: perdido, avistado o rescatado',
  })
  estado: string;

  @IsString()
  @IsIn(['pequeño', 'mediano', 'grande'], {
    message: 'El tamaño debe ser: pequeño, mediano o grande',
  })
  tamano: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  color_principal: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  foto_url?: string;
}
