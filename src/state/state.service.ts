import { Injectable } from '@nestjs/common';
import { StateEntitiy } from './entities/state.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(StateEntitiy)
    private readonly stateRepository: Repository<StateEntitiy>,
  ) {}

  findOne(stateId: number): Promise<StateEntitiy> {
    return this.stateRepository.findOne({
      where: {
        id: stateId,
      },
    });
  }

  findAll(): Promise<Partial<StateEntitiy[]>> {
    return this.stateRepository
      .createQueryBuilder('state')
      .select(['state.id', 'state.name']) // Select only 'id' and 'name' fields
      .getMany();
  }
}
