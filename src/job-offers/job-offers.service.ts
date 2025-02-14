// job-offers.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JobOffer } from '~/model/job-offer.entity'; // Define your entity for the database
import { SourceA } from '~/job-offers-collector/source-a';
import { SourceB } from '~/job-offers-collector/source-b';
import { JobCollector } from '~/job-offers-collector/json-fetcher.service';
import { FindOneOptions, FindOptionsWhere, Repository, Not, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
export type UpsertItem = { ref: string, manipulateType: 'insert' | 'update', data: JobOffer, id: number };
@Injectable()
export class JobOffersService {
    constructor(
        private a: SourceA,
        private b: SourceB,
        @InjectRepository(JobOffer) private jobOfferRepository: Repository<JobOffer> // Use generic TypeORM repository
    ) { }

    async collect(collectors: JobCollector[]): Promise<Array<JobOffer>> {
        return (await Promise.all(collectors.map(c => c.collect()))).flat();
    }

    async triggerCron() {
        await this.handleCron();
    }

    @Cron('0 * * * *') // Every hour
    async handleCron() {
        const collectedJobs = await this.collect([this.a, this.b]);
        console.log('Collected jobs:', collectedJobs);
         for await( const updateItem of  this.upsertJobs(collectedJobs)){
            console.log('Upserted job:', updateItem);
        }
        return collectedJobs
    }

    async *upsertJobs(jobs: JobOffer[]): AsyncIterable<UpsertItem> {
        for (const job of jobs) {
             const matchedJob = await this.jobOfferRepository.findOne({
                where:
                {
                  path:job.GetPath()
                }
            });
            if (!job.industry){ 
                const revisedIndustry=await this.refineIndustry(job)
                if (revisedIndustry) job.industry=revisedIndustry;
            }  
            if (matchedJob?.id) {
                // Update the existing job
                await this.jobOfferRepository.update(matchedJob.id, job);
                yield { ref: job.ref, data: job, manipulateType: 'update', id: matchedJob.id } as UpsertItem;
            } else {
                // Insert the new job
                await this.jobOfferRepository.insert(job);
                yield { ref: job.ref, data: job, manipulateType: 'insert', id: job.id } as UpsertItem;

            }
        }
    
    
    }
    async refineIndustry(jobOffer: JobOffer): Promise<string | null> {
        if (jobOffer.industry) {
          return jobOffer.industry;
        }
        const filters: Array<FindOptionsWhere<JobOffer>> = [
          { company: jobOffer.company, title: jobOffer.title },
          { title: jobOffer.title },
          { company: jobOffer.company }
        ];
    
        for (const where of filters) {
          const result = await this.jobOfferRepository.findOne({
            where: {
              ...where,
              industry: Not(IsNull()) // Use Not(IsNull()) to replace invalid null value
            },
            select: ['industry']
          });
          if (result?.industry) {
            return result.industry;
          }
        }
        return null; // Default value if no industry is found
      }
}