import {
  AccAnalyticEnum,
  AccNatureEnum,
  AccReportEnum,
  AccTypeEnum,
} from 'src/utils/types/enums/acc-types.enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chart_of_accounts')
export class ChartOfAccountsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  tenant_id: string;
  @Column({ type: 'enum', enum: AccTypeEnum })
  acc_type: AccTypeEnum;
  @Column({ type: 'enum', enum: AccReportEnum })
  acc_rep: AccReportEnum;
  @Column({ type: 'enum', enum: AccNatureEnum })
  acc_nat: AccNatureEnum;
  @Column({
    type: 'enum',
    enum: AccAnalyticEnum,
    default: AccAnalyticEnum.GENERAL,
  })
  acc_analy: AccAnalyticEnum;
  @Column({ type: 'int' })
  index: number;
  @Column({ type: 'uuid' })
  created_by: string;
  @Column({ type: 'uuid', nullable: true })
  updated_by: string;
  @Column()
  code: string;
  @Column()
  ar_name: string;
  @Column({ nullable: true })
  en_name: string;
  @Column({ type: 'int' })
  level: number;
  @ManyToOne(() => ChartOfAccountsEntity, (account) => account.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: ChartOfAccountsEntity;
  @OneToMany(() => ChartOfAccountsEntity, (account) => account.parent)
  children: ChartOfAccountsEntity[];
  @Column()
  path: string;
  @Column({ type: 'boolean', default: false })
  is_stoped: boolean;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
