import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsWhere,
  DeepPartial,
} from 'typeorm';
import { FlagEntity } from '../entities/flag.entity';

@Injectable()
export class FlagsDBService {
  constructor(
    @InjectRepository(FlagEntity)
    private readonly flagsRepo: Repository<FlagEntity>,
  ) {}

  getFlagsRepo() {
    return this.flagsRepo;
  }

  flagsQB(alias: string) {
    return this.flagsRepo.createQueryBuilder(alias);
  }

  createFlagInstance(obj: DeepPartial<FlagEntity>) {
    return this.flagsRepo.create(obj);
  }

  async getNextIndex(tenant_id: string) {
    const count = await this.flagsRepo.count({
      where: { tenant_id },
    });
    return count + 1;
  }

  async saveFlag(flag: FlagEntity) {
    let saved: FlagEntity;
    try {
      saved = await this.flagsRepo.save(flag);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to save flag');
    }
    return saved;
  }

  async findOneFlag({
    where,
    select,
    relations,
  }: {
    where: FindOptionsWhere<FlagEntity>;
    select?: FindOptionsSelect<FlagEntity>;
    relations?: string[];
  }) {
    const flag = await this.flagsRepo.findOne({
      where,
      select,
      relations,
    });
    return flag;
  }

  async findFlags({
    where,
    select,
    relations,
  }: {
    where: FindOptionsWhere<FlagEntity>;
    select?: FindOptionsSelect<FlagEntity>;
    relations?: string[];
  }) {
    const [flags, total] = await this.flagsRepo.findAndCount({
      where,
      select,
      relations,
    });
    return { flags, total };
  }
}
