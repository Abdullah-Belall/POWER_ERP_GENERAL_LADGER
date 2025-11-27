import { ConflictException, Injectable } from '@nestjs/common';
import { CurrencyDBService } from './DB_Service/currency_db.service';
import { UserTokenInterface } from 'src/utils/types/interfaces/user-token.interface';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { CurrencyTypeEnum } from 'src/utils/types/enums/currency-type.enum';

@Injectable()
export class CurrencyService {
  constructor(private readonly currencyDBService: CurrencyDBService) {}
  async addCurrency(
    { tenant_id, id }: UserTokenInterface,
    createCurrencyDto: CreateCurrencyDto,
  ) {
    const {
      type,
      is_stock_currency,
      ar_name,
      en_name,
      rate,
      min_exchange_limit,
      max_exchange_limit,
    } = createCurrencyDto;
    if (is_stock_currency) {
      const stockCurrencyCount = await this.currencyDBService
        .getCurrencyRepo()
        .count({
          where: {
            tenant_id,
            is_stock_currency: true,
          },
        });
      if (stockCurrencyCount !== 0) {
        throw new ConflictException('يوجد عملة مخزون بالفعل.');
      }
    }
    if (type === CurrencyTypeEnum.LOCAL_CURRENCY) {
      const localCurrencyCount = await this.currencyDBService
        .getCurrencyRepo()
        .count({
          where: {
            tenant_id,
            type: CurrencyTypeEnum.LOCAL_CURRENCY,
          },
        });
      if (localCurrencyCount !== 0) {
        throw new ConflictException('يوجد عملة محلية بالفعل');
      }
    }
    const isDublicateArName = await this.currencyDBService
      .getCurrencyRepo()
      .count({
        where: {
          tenant_id,
          ar_name,
        },
      });
    if (isDublicateArName !== 0) {
      throw new ConflictException();
    }
    if (en_name) {
      const isDublicateErName = await this.currencyDBService
        .getCurrencyRepo()
        .count({
          where: {
            tenant_id,
            en_name,
          },
        });
      if (isDublicateErName !== 0) {
        throw new ConflictException();
      }
    }
    const currencyInstance = this.currencyDBService.createCurrencyInstance({
      ...createCurrencyDto,
      tenant_id,
      index: await this.currencyDBService.getNextIndex(tenant_id),
      created_by: id,
      rate: Number(rate),
      min_exchange_limit: Number(min_exchange_limit),
      max_exchange_limit: Number(max_exchange_limit),
    });
    await this.currencyDBService.saveCurrency(currencyInstance);
    return {
      done: true,
    };
  }
  async getAllCurrency(tenant_id: string) {
    return await this.currencyDBService.findCurrency({
      where: {
        tenant_id,
      },
    });
  }
}
