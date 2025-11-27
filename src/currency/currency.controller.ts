import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { User } from 'src/decorators/user.decorator';
import type { UserTokenInterface } from 'src/utils/types/interfaces/user-token.interface';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}
  @Get()
  async getAllCurrency(@User() { tenant_id }: UserTokenInterface) {
    return await this.currencyService.getAllCurrency(tenant_id);
  }
  @Post()
  @UseGuards(AuthGuard)
  async addCurrency(
    @User() user: UserTokenInterface,
    @Body() createCurrencyDto: CreateCurrencyDto,
  ) {
    return await this.currencyService.addCurrency(user, createCurrencyDto);
  }
}
