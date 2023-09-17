import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { PeopleModule } from './people/people.module';
import { StateModule } from './state/state.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
    }),
    PeopleModule,
    StateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
