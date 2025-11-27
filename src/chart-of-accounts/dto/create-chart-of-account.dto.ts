import {
  IsEnum,
  IsJSON,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  AccAnalyticEnum,
  AccNatureEnum,
  AccReportEnum,
  AccTypeEnum,
} from 'src/utils/types/enums/acc-types.enums';

export class CreateChartOfAccountDto {
  @IsString()
  ar_name: string;
  @IsString()
  @IsOptional()
  en_name: string;
  @IsUUID()
  @IsOptional()
  parent_id?: string;
  @IsEnum(AccAnalyticEnum)
  @IsOptional()
  acc_analy: AccAnalyticEnum;
  @IsEnum(AccTypeEnum)
  acc_type: AccTypeEnum;
  @IsEnum(AccReportEnum)
  acc_rep: AccReportEnum;
  @IsEnum(AccNatureEnum)
  acc_nat: AccNatureEnum;
}
