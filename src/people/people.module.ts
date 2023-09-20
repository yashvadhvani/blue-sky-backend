import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PersonEntity } from './entities/person.entity';

import { PeopleController } from './people.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateEntitiy } from 'src/state/entities/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity, StateEntitiy])],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
