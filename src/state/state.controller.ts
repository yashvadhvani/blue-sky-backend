import { Controller, Get, Param } from '@nestjs/common';
import { StateService } from './state.service';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get('')
  findAll() {
    return this.stateService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stateService.findOne(+id);
  }
}
