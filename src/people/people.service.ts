import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonEntity } from './entities/person.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(PersonEntity)
    private readonly peopleRepository: Repository<PersonEntity>,
  ) {}

  async findPeopleWithinState(
    stateId: number,
    page: number,
    limit: number,
  ): Promise<{
    data: PersonEntity[];
    count: number;
    page: number;
    limit: number;
  }> {
    const offset = (page - 1) * limit;
    const subquery = this.peopleRepository
      .createQueryBuilder('subquery')
      .select('COUNT(*)')
      .where(
        'ST_Within(subquery.location, (SELECT boundary FROM states WHERE id = :stateId)::geometry)',
        {
          stateId,
        },
      );
    const peopleQuery = this.peopleRepository
      .createQueryBuilder('people')
      .select(['people.id', 'people.first_name', 'people.last_name'])
      .addSelect(`(${subquery.getQuery()})`, 'count')
      .where(
        'ST_Within(people.location, (SELECT boundary FROM states WHERE id = :stateId)::geometry)',
        {
          stateId,
        },
      )
      .orderBy('people.id')
      .offset(offset)
      .limit(limit);
    const [people, count] = await peopleQuery.getManyAndCount();
    return {
      data: people,
      count,
      page,
      limit,
    };
  }
}
