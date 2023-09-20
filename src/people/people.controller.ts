// src/people/people.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { PeopleService } from './people.service';
import { ApiQuery } from '@nestjs/swagger';
import { PEOPLE } from 'src/constants';

@Controller(PEOPLE)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get('states/:stateId')
  @ApiQuery({ required: false, name: 'page' })
  @ApiQuery({ required: false, name: 'limit' })
  async findPeopleInState(
    @Param('stateId') id: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      if (!limit) {
        limit = '10';
      }
      if (!page) {
        page = '1';
      }
      const result = await this.peopleService.findPeopleWithinState(
        id,
        parseInt(page, 10),
        parseInt(limit, 10),
      );
      return result;
    } catch (error) {
      console.log('LL: PeopleController -> constructor -> error', error);
    }
  }
}
