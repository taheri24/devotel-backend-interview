import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import type { ExternalSource1 } from './external-source1';
import { ExternalSource2 } from './external-source2';
import { JobOffer } from '~/model/job-offer.entity';
export interface JobCollector{
    collect():Promise<Array<JobOffer>>
}

@Injectable()
export class JsonFetcherService {


    async fetchJson<T>(url: string): Promise<T> {

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching jobs from provider 1: ${response.statusText}`);
            }
            return (await response.json()) as T;

        } catch (error) {
            console.error('Error fetching jobs from provider ', error);
            throw error;
        }
    }

}
