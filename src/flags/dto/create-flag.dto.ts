import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { FlagsTypesEnum } from 'src/utils/types/enums/flags.enum';

export class CreateFlagDto {
  @IsEnum(FlagsTypesEnum)
  type: FlagsTypesEnum;
  @IsString()
  ar_name: string;
  @IsString()
  @IsOptional()
  en_name: string;
  @IsBoolean()
  @IsOptional()
  be_affected: string;
}
