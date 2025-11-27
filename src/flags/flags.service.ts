import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFlagDto } from './dto/create-flag.dto';
import { FlagsDBService } from './DB_Service/flags_db.service';
import { UserTokenInterface } from 'src/utils/types/interfaces/user-token.interface';
import { FlagsTypesEnum } from 'src/utils/types/enums/flags.enum';

@Injectable()
export class FlagsService {
  constructor(private readonly flagsDBService: FlagsDBService) {}

  async addFlag(
    { tenant_id, id }: UserTokenInterface,
    { ar_name, en_name, type }: CreateFlagDto,
  ) {
    const isDublicateArFlag = await this.flagsDBService.getFlagsRepo().count({
      where: {
        tenant_id,
        ar_name,
      },
    });
    if (isDublicateArFlag !== 0) {
      throw new ConflictException();
    }
    const isDublicateEnFlag = await this.flagsDBService.getFlagsRepo().count({
      where: {
        tenant_id,
        en_name,
      },
    });
    if (isDublicateEnFlag !== 0) {
      throw new ConflictException();
    }
    const instance = this.flagsDBService.createFlagInstance({
      ar_name,
      en_name,
      type,
      tenant_id,
      created_by: id,
      index: await this.flagsDBService.getNextIndex(tenant_id),
    });
    await this.flagsDBService.saveFlag(instance);
    return {
      done: true,
    };
  }

  async getFlags(tenant_id: string, type: FlagsTypesEnum) {
    return await this.flagsDBService.findFlags({
      where: {
        tenant_id,
        type,
      },
    });
  }
  async getFlagAsOptions(tenant_id: string, flagType: FlagsTypesEnum) {
    const { flags } = await this.flagsDBService.findFlags({
      where: {
        tenant_id,
        type: flagType,
      },
    });
    return flags.map((e) => ({
      id: e.id,
      ar_name: e.ar_name,
      en_name: e.en_name,
    }));
  }
  async getFlagsForCreateChartOfAccounts(tenant_id: string) {
    const account_types = await this.getFlagAsOptions(
      tenant_id,
      FlagsTypesEnum.ACCOUNT_TYPE,
    );
    const report_types = await this.getFlagAsOptions(
      tenant_id,
      FlagsTypesEnum.ACCOUNT_REPORT,
    );
    const account_nature = await this.getFlagAsOptions(
      tenant_id,
      FlagsTypesEnum.ACCOUNT_NATURE,
    );
    const account_class = await this.getFlagAsOptions(
      tenant_id,
      FlagsTypesEnum.ACCOUNT_CLASS,
    );
    const account_group = await this.getFlagAsOptions(
      tenant_id,
      FlagsTypesEnum.ACCOUNT_GROUP,
    );
    const account_analy = await this.getFlagAsOptions(
      tenant_id,
      FlagsTypesEnum.ACCOUNT_ANALYTIC,
    );
    return {
      account_types,
      report_types,
      account_nature,
      account_class,
      account_group,
      account_analy,
    };
  }
}
