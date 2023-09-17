import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PersonEntity } from './entities/person.entity';

import { PeopleController } from './people.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity])],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
