import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePerfileDto } from './dto/create-perfile.dto';
import { UpdatePerfileDto } from './dto/update-perfile.dto';
import { Perfile } from './entities/perfile.entity';

@Injectable()
export class PerfilesService {
  constructor(
    @InjectRepository(Perfile)
    private readonly perfilRepository: Repository<Perfile>,
  ) {}

  async create(createPerfileDto: CreatePerfileDto) {
    const nuevoPerfil = this.perfilRepository.create(createPerfileDto);
    return await this.perfilRepository.save(nuevoPerfil);
  }

  async findAll() {
    return await this.perfilRepository.find({
      relations: {
        reportes: true,
      },
    });
  }

  async findOne(id: string) {
    const perfil = await this.perfilRepository.findOne({
      where: { id },
      relations: {
        reportes: true,
      },
    });
    if (!perfil) {
      throw new NotFoundException(`El perfil con ID ${id} no existe`);
    }
    return perfil;
  }

  async update(id: string, updatePerfileDto: UpdatePerfileDto) {
    const perfil = await this.findOne(id);
    Object.assign(perfil, updatePerfileDto);
    return await this.perfilRepository.save(perfil);
  }

  async remove(id: string) {
    const perfil = await this.findOne(id);
    return await this.perfilRepository.remove(perfil);
  }
}
