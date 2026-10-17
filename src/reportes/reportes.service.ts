import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { Reporte } from './entities/reporte.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepository: Repository<Reporte>,
  ) {}

  // POST /reportes -> Guarda un nuevo perrito en el mapa
  async create(createReporteDto: CreateReporteDto) {
    const nuevoReporte = this.reporteRepository.create(createReporteDto);
    return await this.reporteRepository.save(nuevoReporte);
  }

  // GET /reportes -> Devuelve todos los reportes (del más nuevo al más viejo)
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

  // GET /reportes/:id -> Busca un reporte específico por su UUID
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

  // PATCH /reportes/:id -> Ejemplo: cambiar estado de 'perdido' a 'rescatado'
  async update(id: string, updateReporteDto: UpdateReporteDto) {
    const reporte = await this.findOne(id);
    Object.assign(reporte, updateReporteDto);
    return await this.reporteRepository.save(reporte);
  }

  // DELETE /reportes/:id -> Elimina el reporte
  async remove(id: string) {
    const reporte = await this.findOne(id);
    return await this.reporteRepository.remove(reporte);
  }
}
