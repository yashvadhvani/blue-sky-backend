import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonEntity } from './entities/person.entity';
import { StateEntitiy } from 'src/state/entities/state.entity';
import { PEOPLE, STATES } from '../constants';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(PersonEntity)
    private readonly peopleRepository: Repository<PersonEntity>,
    @InjectRepository(StateEntitiy)
    private readonly stateRepository: Repository<StateEntitiy>,
  ) {}

  async findPeopleWithinState(
    stateId: number,
    page: number,
    limit: number,
  ): Promise<{
    data: PersonEntity[];
    isLastPage: boolean;
    next: string | null;
    previous: string | null;
    limit: number;
    page: number;
  }> {
    const offset = (page - 1) * limit;

    // Use a spatial query to find people whose `location` is within the `boundary` of the state
    const peopleInsideState = await this.peopleRepository
      .createQueryBuilder(PEOPLE)
      .select([`${PEOPLE}.id`, `${PEOPLE}.first_name`, `${PEOPLE}.last_name`])
      .where(
        `ST_Within(${PEOPLE}.location, (SELECT boundary FROM ${STATES} WHERE id = :stateId)::geometry)`,
        {
          stateId,
        },
      )
      .orderBy('people.id')
      .skip(offset) // Pagination OFFSET
      .take(limit) // Pagination LIMIT
      .getMany();

    return {
      data: peopleInsideState,
      isLastPage: !(peopleInsideState.length > 0),
      next:
        peopleInsideState.length > 0
          ? `/people/${stateId}?page=${page + 1}&limit=${limit}`
          : null,
      previous:
        peopleInsideState.length > 0 && page > 0
          ? `/people/${stateId}?page${page - 1}&limit=${limit}`
          : null,
      page,
      limit,
    };
  }
}
