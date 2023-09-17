// src/people/people.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get(':stateId')
  async findPeopleInState(
    @Param('stateId') id: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    try {
      if (!limit) {
        limit = 10;
      }
      if (!page) {
        page = 1;
      }
      const result = await this.peopleService.findPeopleWithinState(
        id,
        page,
        limit,
      );
      return result;
    } catch (error) {
      console.log('LL: PeopleController -> constructor -> error', error);
    }
  }
}
