import { Controller, Get, Param } from '@nestjs/common';
import { STATES } from '../constants';
import { StateService } from './state.service';

@Controller(STATES)
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
