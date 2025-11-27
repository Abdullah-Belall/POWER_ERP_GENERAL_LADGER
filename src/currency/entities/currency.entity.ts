import { CurrencyTypeEnum } from 'src/utils/types/enums/currency-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'currency' })
export class CurrencyEntity {
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
  @Column()
  ar_name: string;
  @Column({ nullable: true })
  en_name: string;
  @Column()
  symbol: string;
  @Column()
  ar_change: string;
  @Column({ nullable: true })
  en_change: string;
  @Column({ type: 'enum', enum: CurrencyTypeEnum })
  type: CurrencyTypeEnum;
  @Column({ type: 'boolean' })
  is_stock_currency: boolean;
  @Column({ type: 'decimal' })
  rate: number;
  @Column({ type: 'decimal' })
  max_exchange_limit: number;
  @Column({ type: 'decimal' })
  min_exchange_limit: number;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @CreateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
