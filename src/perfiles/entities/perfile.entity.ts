import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reporte } from '../../reportes/entities/reporte.entity';

@Entity('perfiles')
export class Perfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre_usuario: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date;

  @OneToMany(() => Reporte, (reporte) => reporte.perfil)
  reportes: Reporte[];
}
