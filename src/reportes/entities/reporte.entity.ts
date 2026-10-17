import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Perfile } from '../../perfiles/entities/perfile.entity';

@Entity('reportes')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  usuario_id: string;

  @Column({ type: 'float' })
  latitud: number;

  @Column({ type: 'float' })
  longitud: number;

  @Column({ type: 'varchar', length: 50 })
  estado: string; // 'perdido', 'avistado', 'rescatado'

  @Column({ type: 'varchar', length: 50 })
  tamano: string; // 'pequeño', 'mediano', 'grande'

  @Column({ type: 'varchar', length: 50 })
  color_principal: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  foto_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date;

  @ManyToOne(() => Perfile, (perfil) => perfil.reportes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  perfil: Perfile;
}
