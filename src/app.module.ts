import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobOffersController } from './job-offers/job-offers.controller';
import { JobOffersService } from './job-offers/job-offers.service';
import { JsonFetcherService } from './job-offers-collector/json-fetcher.service';
import { SourceA } from './job-offers-collector/source-a';
import { SourceB } from './job-offers-collector/source-b';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOffer } from './model/job-offer.entity';
import { AppDataSource, datasourceOpts } from './datasource';
 
@Module({
  imports: [
    TypeOrmModule.forRoot( datasourceOpts),
    TypeOrmModule.forFeature([JobOffer])
  ],
  controllers: [AppController, JobOffersController],
  providers: [
    AppService, 
    JobOffersService, 
    JsonFetcherService,
    SourceA,
    SourceB
  ],
})
export class AppModule {}
