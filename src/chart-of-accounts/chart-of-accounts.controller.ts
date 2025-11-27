import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import type { UserTokenInterface } from 'src/utils/types/interfaces/user-token.interface';
import { CreateChartOfAccountDto } from './dto/create-chart-of-account.dto';

@Controller('chart-of-accounts')
@UseGuards(AuthGuard)
export class ChartOfAccountsController {
  constructor(
    private readonly chartOfAccountsService: ChartOfAccountsService,
  ) {}

  @Post()
  async addAccount(
    @User() user: UserTokenInterface,
    @Body() createChartOfAccountDto: CreateChartOfAccountDto,
  ) {
    return await this.chartOfAccountsService.addAccount(
      user,
      createChartOfAccountDto,
    );
  }

  @Get()
  async getAccounts(@User() { tenant_id }: UserTokenInterface) {
    return await this.chartOfAccountsService.getAccounts(tenant_id);
  }

  @Get('main-accounts-select-list')
  async getMainAccountsSelectList(@User() { tenant_id }: UserTokenInterface) {
    return await this.chartOfAccountsService.getMainAccountsSelectList(
      tenant_id,
    );
  }

  @Get('tree-view')
  async getAccountsTree(@User() { tenant_id }: UserTokenInterface) {
    return await this.chartOfAccountsService.getAccountsTree(tenant_id);
  }
}
