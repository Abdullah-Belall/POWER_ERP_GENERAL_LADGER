import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChartOfAccountDto } from './dto/create-chart-of-account.dto';
import { ChartOfAccountsDBService } from './DB_Service/chart-of-accounts_db.service';
import { UserTokenInterface } from 'src/utils/types/interfaces/user-token.interface';
import { ChartOfAccountsEntity } from './entities/chart-of-account.entity';
import { FlagsDBService } from 'src/flags/DB_Service/flags_db.service';
import { FlagEntity } from 'src/flags/entities/flag.entity';
import { FlagsTypesEnum } from 'src/utils/types/enums/flags.enum';
import { AccTypeEnum } from 'src/utils/types/enums/acc-types.enums';

@Injectable()
export class ChartOfAccountsService {
  constructor(
    private readonly chartOfAccountsDBService: ChartOfAccountsDBService,
    private readonly flagsDBService: FlagsDBService,
  ) {}

  async addAccount(
    { tenant_id, id }: UserTokenInterface,
    {
      ar_name,
      en_name,
      parent_id,
      acc_analy,
      acc_nat,
      acc_rep,
      acc_type,
    }: CreateChartOfAccountDto,
  ) {
    const isDuplicateArNameAccount = await this.chartOfAccountsDBService
      .getChartRepo()
      .count({
        where: {
          tenant_id,
          ar_name,
          parent: {
            id: parent_id,
          },
        },
      });
    if (isDuplicateArNameAccount !== 0) {
      throw new ConflictException();
    }
    const isDuplicateEnNameAccount = await this.chartOfAccountsDBService
      .getChartRepo()
      .count({
        where: {
          tenant_id,
          en_name,
          parent: {
            id: parent_id,
          },
        },
      });
    if (isDuplicateEnNameAccount !== 0) {
      throw new ConflictException();
    }
    let parent: ChartOfAccountsEntity | null = null;
    if (parent_id) {
      parent = await this.chartOfAccountsDBService.findOneChart({
        where: {
          id: parent_id,
          tenant_id,
        },
        relations: ['children'],
        select: {
          children: {
            id: true,
          },
        },
      });
      if (!parent) {
        throw new NotFoundException();
      }
    }
    // const parsedFlags: string[] = JSON.parse(flags);
    // const flagsArr: FlagEntity[] = [];
    // for (const flagId of parsedFlags) {
    //   const flag = await this.flagsDBService.findOneFlag({
    //     where: {
    //       id: flagId,
    //       tenant_id,
    //     },
    //   });
    //   if (!flag) {
    //     throw new NotFoundException('Flag Not Found');
    //   }
    //   flagsArr.push(flag);
    // }
    const rootAccountsCount = parent
      ? 0
      : await this.chartOfAccountsDBService
          .chartQB('chart')
          .where('chart.tenant_id = :tenant_id', { tenant_id })
          .andWhere('chart.parent_id IS NULL')
          .getCount();

    const instance = this.chartOfAccountsDBService.createChartInstance({
      code: parent
        ? parent.code +
          (acc_type === AccTypeEnum.SUB ? '00' : '') +
          (parent.children.length + 1).toString()
        : (rootAccountsCount + 1).toString(),
      created_by: id,
      tenant_id,
      ar_name,
      en_name,
      level: (parent?.level || 0) + 1,
      path: parent ? parent.path + '/' + '1' : '1',
      parent: parent as ChartOfAccountsEntity,
      index: await this.chartOfAccountsDBService.getNextIndex(tenant_id),
      acc_analy,
      acc_nat,
      acc_rep,
      acc_type,
    });
    await this.chartOfAccountsDBService.saveChart(instance);
    return {
      done: true,
    };
  }

  async getAccounts(tenant_id: string) {
    const [accounts, total] = await this.chartOfAccountsDBService
      .chartQB('acc')
      .where('acc.tenant_id = :tenant_id', { tenant_id })
      .leftJoin('acc.parent', 'acc_parent')
      .addSelect(['acc_parent.id', 'acc_parent.code'])
      .loadRelationCountAndMap('acc.children_count', 'acc.children')
      .getManyAndCount();
    return {
      accounts,
      total,
    };
  }

  async getMainAccountsSelectList(tenant_id: string) {
    const [accounts, total] = await this.chartOfAccountsDBService
      .chartQB('acc')
      .where('acc.tenant_id = :tenant_id', { tenant_id })
      .andWhere('acc.acc_type = :type', { type: AccTypeEnum.MAIN })
      .getManyAndCount();
    return {
      accounts,
      total,
    };
  }

  async getAccountsTree(tenant_id: string) {
    const flatAccounts = await this.chartOfAccountsDBService
      .chartQB('chart')
      .leftJoinAndSelect('chart.parent', 'parent')
      .select([
        'chart.id',
        'chart.level',
        'chart.code',
        'chart.en_name',
        'chart.ar_name',
        'parent.id',
        'parent.level',
        'parent.code',
        'parent.en_name',
        'parent.ar_name',
      ])
      .where('chart.tenant_id = :tenant_id', { tenant_id })
      .orderBy('chart.level', 'ASC')
      .addOrderBy('chart.index', 'ASC')
      .getMany();

    const accountsMap = new Map<string, ChartOfAccountsEntity>();
    for (const account of flatAccounts) {
      account.children = [];
      accountsMap.set(account.id, account);
    }

    const roots: ChartOfAccountsEntity[] = [];
    for (const account of flatAccounts) {
      const parentId = account.parent?.id;
      if (parentId && accountsMap.has(parentId)) {
        accountsMap.get(parentId)?.children.push(account);
      } else if (account.level === 1) {
        roots.push(account);
      }
    }
    return {
      done: true,
      roots,
    };
  }
}
