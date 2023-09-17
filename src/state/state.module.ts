import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { StateEntitiy } from './entities/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StateEntitiy])],
  controllers: [StateController],
  providers: [StateService],
})
export class StateModule {}
