import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { Reporte } from './entities/reporte.entity';

@Injectable()
export class ReportesService {
  private supabase: SupabaseClient;

  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepository: Repository<Reporte>,
    private readonly configService: ConfigService,
  ) {
    // Inicializamos el cliente de Supabase para Storage
    this.supabase = createClient(
      this.configService.get<string>('NEXT_PUBLIC_SUPABASE_URL')!,
      this.configService.get<string>('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')!,
    );
  }

  // Sube la imagen al bucket 'fotos-perritos' y devuelve la URL publica
  async subirFoto(file: Express.Multer.File): Promise<{ foto_url: string }> {
    if (!file) {
      throw new BadRequestException(
        'No se proporcionó ningún archivo de imagen',
      );
    }

    // Generamos un nombre unico para evitar que fotos con el mismo nombre se sobrescriban
    const extension = file.originalname.split('.').pop();
    const nombreArchivo = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;

    const { error } = await this.supabase.storage
      .from('fotos-perritos')
      .upload(nombreArchivo, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(
        `Error al subir imagen a Supabase: ${error.message}`,
      );
    }

    // Obtenemos la URL publica de la foto recien subida
    const { data } = this.supabase.storage
      .from('fotos-perritos')
      .getPublicUrl(nombreArchivo);

    return { foto_url: data.publicUrl };
  }

  async create(createReporteDto: CreateReporteDto) {
    const nuevoReporte = this.reporteRepository.create(createReporteDto);
    return await this.reporteRepository.save(nuevoReporte);
  }

  async findAll() {
    return await this.reporteRepository.find({
      relations: {
        perfil: true,
      },
      order: {
        creado_en: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const reporte = await this.reporteRepository.findOne({
      where: { id },
      relations: {
        perfil: true,
      },
    });
    if (!reporte) {
      throw new NotFoundException(`El reporte con ID ${id} no existe`);
    }
    return reporte;
  }

  async update(id: string, updateReporteDto: UpdateReporteDto) {
    const reporte = await this.findOne(id);
    Object.assign(reporte, updateReporteDto);
    return await this.reporteRepository.save(reporte);
  }

  async remove(id: string) {
    const reporte = await this.findOne(id);
    return await this.reporteRepository.remove(reporte);
  }
}
