import { Module } from '@nestjs/common';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { ChartOfAccountsController } from './chart-of-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartOfAccountsEntity } from './entities/chart-of-account.entity';
import { ChartOfAccountsDBService } from './DB_Service/chart-of-accounts_db.service';
import { FlagsModule } from 'src/flags/flags.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChartOfAccountsEntity]), FlagsModule],
  controllers: [ChartOfAccountsController],
  providers: [ChartOfAccountsService, ChartOfAccountsDBService],
  exports: [ChartOfAccountsDBService],
})
export class ChartOfAccountsModule {}
