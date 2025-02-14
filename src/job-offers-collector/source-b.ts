import { JobOffer } from "~/model/job-offer.entity";
import { compensation2String, ExternalSource2 } from "./external-source2";
import { Injectable } from "@nestjs/common";
import { type JobCollector, JsonFetcherService } from "./json-fetcher.service";

@Injectable()
export class SourceB implements JobCollector {
    constructor(private jsonFetcher: JsonFetcherService) {

    }

    async collect(): Promise<Array<JobOffer>> {
        const data = await this.jsonFetcher.fetchJson<ExternalSource2>('https://assignment.devotel.io/api/provider2/jobs');
        return Object.entries(data.data?.jobsList).map(([jobID, obj]) => ({ jobID, ...obj })).map(job =>
            new JobOffer({
                ref: job.jobID,
                title: job.position,
                location: job.location.city,
                salaryRange: compensation2String(job.compensation),
                postedDate: job.datePosted,
                company: job.employer.companyName,
                skills: job.requirements.technologies.join(', '),  // TODO: format this properly 
                source: 'SourceB',
            }));
    }

}
