import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FlagsService } from './flags.service';
import { CreateFlagDto } from './dto/create-flag.dto';
import { User } from 'src/decorators/user.decorator';
import type { UserTokenInterface } from 'src/utils/types/interfaces/user-token.interface';
import { AuthGuard } from 'src/guards/auth.guard';
import { FlagsTypesEnum } from 'src/utils/types/enums/flags.enum';

@Controller('flags')
@UseGuards(AuthGuard)
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Post()
  async addFlag(
    @User() user: UserTokenInterface,
    @Body() createFlagDto: CreateFlagDto,
  ) {
    return await this.flagsService.addFlag(user, createFlagDto);
  }
  @Get('flags-for-accounts')
  async getFlagsForCreateChartOfAccounts(
    @User() { tenant_id }: UserTokenInterface,
  ) {
    return await this.flagsService.getFlagsForCreateChartOfAccounts(tenant_id);
  }
  @Get(':type')
  async getFlags(
    @User() { tenant_id }: UserTokenInterface,
    @Param('type', new ParseEnumPipe(FlagsTypesEnum)) type: FlagsTypesEnum,
  ) {
    return await this.flagsService.getFlags(tenant_id, type);
  }
}
