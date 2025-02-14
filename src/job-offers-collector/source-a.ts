import { JobOffer } from "~/model/job-offer.entity";
import { ExternalSource1 } from "./external-source1";
import { type JobCollector, JsonFetcherService } from "./json-fetcher.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SourceA implements JobCollector {
  constructor(private jsonFetcher: JsonFetcherService) {

  }
  async collect(): Promise<Array<JobOffer>> {
    const data = await this.jsonFetcher.fetchJson<ExternalSource1>('https://assignment.devotel.io/api/provider1/jobs');
    return data.jobs.map(job => new JobOffer({
      ref: job.jobId,
      title: job.title,
      location: job.details.location,
      salaryRange: job.details.salaryRange,
      postedDate: job.postedDate.substring(0, 10),
      company: job.company.name,
      industry: job.company.industry,
      skills: job.skills.join(', '),
      source: 'SourceA',
    } as JobOffer));
  }
}
