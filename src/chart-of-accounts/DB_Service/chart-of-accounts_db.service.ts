import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { ChartOfAccountsEntity } from '../entities/chart-of-account.entity';

@Injectable()
export class ChartOfAccountsDBService {
  constructor(
    @InjectRepository(ChartOfAccountsEntity)
    private readonly chartRepo: Repository<ChartOfAccountsEntity>,
  ) {}

  getChartRepo() {
    return this.chartRepo;
  }

  chartQB(alias: string) {
    return this.chartRepo.createQueryBuilder(alias);
  }

  createChartInstance(obj: DeepPartial<ChartOfAccountsEntity>) {
    return this.chartRepo.create(obj);
  }

  async saveChart(account: ChartOfAccountsEntity) {
    let saved: ChartOfAccountsEntity;
    try {
      saved = await this.chartRepo.save(account);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to save chart-of-account');
    }
    return saved;
  }
  async getNextIndex(tenant_id: string) {
    const count = await this.chartRepo.count({
      where: { tenant_id },
    });
    return count + 1;
  }
  async findOneChart({
    where,
    select,
    relations,
  }: {
    where: FindOptionsWhere<ChartOfAccountsEntity>;
    select?: FindOptionsSelect<ChartOfAccountsEntity>;
    relations?: string[];
  }) {
    const account = await this.chartRepo.findOne({
      where,
      select,
      relations,
    });
    return account;
  }

  async findCharts({
    where,
    select,
    relations,
  }: {
    where: FindOptionsWhere<ChartOfAccountsEntity>;
    select?: FindOptionsSelect<ChartOfAccountsEntity>;
    relations?: string[];
  }) {
    const [accounts, total] = await this.chartRepo.findAndCount({
      where,
      select,
      relations,
    });
    return { accounts, total };
  }
}
