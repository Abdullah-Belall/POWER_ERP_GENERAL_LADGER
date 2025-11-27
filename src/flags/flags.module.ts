import { Module } from '@nestjs/common';
import { FlagsService } from './flags.service';
import { FlagsController } from './flags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlagEntity } from './entities/flag.entity';
import { FlagsDBService } from './DB_Service/flags_db.service';

@Module({
  imports: [TypeOrmModule.forFeature([FlagEntity])],
  controllers: [FlagsController],
  providers: [FlagsService, FlagsDBService],
  exports: [FlagsDBService],
})
export class FlagsModule {}
