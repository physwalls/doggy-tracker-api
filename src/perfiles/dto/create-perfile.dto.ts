import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreatePerfileDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @MaxLength(100)
  nombre_usuario: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;
}
