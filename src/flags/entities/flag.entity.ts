import { ChartOfAccountsEntity } from 'src/chart-of-accounts/entities/chart-of-account.entity';
import { FlagsTypesEnum } from 'src/utils/types/enums/flags.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'flags' })
export class FlagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  tenant_id: string;
  @Column({ type: 'int' })
  index: number;
  @Column({ type: 'uuid' })
  created_by: string;
  @Column({ type: 'uuid', nullable: true })
  updated_by: string;
  @Column({ type: 'enum', enum: FlagsTypesEnum })
  type: FlagsTypesEnum;
  @Column({ type: 'boolean', nullable: true })
  be_affected?: boolean;
  @Column()
  ar_name: string;
  @Column({ nullable: true })
  en_name: string;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
