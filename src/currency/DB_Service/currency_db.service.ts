import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsWhere,
  DeepPartial,
} from 'typeorm';
import { CurrencyEntity } from '../entities/currency.entity';

@Injectable()
export class CurrencyDBService {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepo: Repository<CurrencyEntity>,
  ) {}
  getCurrencyRepo() {
    return this.currencyRepo;
  }
  currencyQB(alias: string) {
    return this.currencyRepo.createQueryBuilder(alias);
  }
  createCurrencyInstance(obj: DeepPartial<CurrencyEntity>) {
    return this.currencyRepo.create(obj);
  }
  async getNextIndex(tenant_id: string) {
    const count = await this.currencyRepo.count({
      where: { tenant_id },
    });
    return count + 1;
  }
  async saveCurrency(currency: CurrencyEntity) {
    let saved: CurrencyEntity;
    try {
      saved = await this.currencyRepo.save(currency);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to save currency');
    }
    return saved;
  }
  async findOneCurrency({
    where,
    select,
    relations,
  }: {
    where: FindOptionsWhere<CurrencyEntity>;
    select?: FindOptionsSelect<CurrencyEntity>;
    relations?: string[];
  }) {
    const currency = await this.currencyRepo.findOne({
      where,
      select,
      relations,
    });
    return currency;
  }
  async findCurrency({
    where,
    select,
    relations,
  }: {
    where: FindOptionsWhere<CurrencyEntity>;
    select?: FindOptionsSelect<CurrencyEntity>;
    relations?: string[];
  }) {
    const [currencies, total] = await this.currencyRepo.findAndCount({
      where,
      select,
      relations,
    });
    return { currencies, total };
  }
}
