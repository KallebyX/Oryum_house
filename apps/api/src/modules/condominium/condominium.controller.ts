import { Controller, Get } from '@nestjs/common';
import { CondominiumService } from './condominium.service';

@Controller('condominiums')
export class CondominiumController {
  constructor(private readonly condominiumService: CondominiumService) {}

  @Get()
  findAll() {
    return this.condominiumService.findAll();
  }
}
