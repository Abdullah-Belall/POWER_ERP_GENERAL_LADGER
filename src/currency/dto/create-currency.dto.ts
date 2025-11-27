import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CurrencyTypeEnum } from 'src/utils/types/enums/currency-type.enum';

export class CreateCurrencyDto {
  @IsString()
  ar_name: string;
  @IsString()
  @IsOptional()
  en_name?: string;
  @IsString()
  symbol: string;
  @IsString()
  ar_change: string;
  @IsString()
  @IsOptional()
  en_change?: string;
  @IsEnum(CurrencyTypeEnum)
  type: CurrencyTypeEnum;
  @IsBoolean()
  is_stock_currency: boolean;
  @IsNumber()
  rate: number;
  @IsNumber()
  max_exchange_limit: number;
  @IsNumber()
  min_exchange_limit: number;
}
