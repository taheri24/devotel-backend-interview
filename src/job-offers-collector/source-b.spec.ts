import { Test, TestingModule } from '@nestjs/testing';
import { SourceB } from './source-b';
import { JsonFetcherService } from './json-fetcher.service';
import { JobOffer } from '~/model/job-offer.entity';
import { ExternalSource2 } from './external-source2';

describe('SourceB', () => {
  let service: SourceB;
  let jsonFetcherService: JsonFetcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SourceB,
        {
          provide: JsonFetcherService,
          useValue: {
            fetchJson: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SourceB>(SourceB);
    jsonFetcherService = module.get<JsonFetcherService>(JsonFetcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and transform data correctly', async () => {
    const mockData: ExternalSource2 = {
      status: 'success',
      data: {
        jobsList: {
          'job-408': {
            position: 'Frontend Developer',
            location: {
              city: 'Seattle',
              state: 'WA',
              remote: false,
            },
            compensation: {
              min: 58000,
              max: 81000,
              currency: 'USD',
            },
            employer: {
              companyName: 'BackEnd Solutions',
              website: 'https://dataworks.com',
            },
            requirements: {
              experience: 5,
              technologies: ['HTML', 'CSS', 'Vue.js'],
            },
            datePosted: '2025-02-06',
          },
        },
      },
    };

    jest.spyOn(jsonFetcherService, 'fetchJson').mockResolvedValue(mockData);

    const result = await service.collect();

    expect(result).toEqual([
      {
        ref: 'job-408',
        title: 'Frontend Developer',
        location: 'Seattle',
        salaryRange: JSON.stringify({
          min: 58000,
          max: 81000,
          currency: 'USD',
        }),
        postedDate: '2025-02-06',
        company: 'BackEnd Solutions',
        industry: 'X',
        skills: JSON.stringify({
          experience: 5,
          technologies: ['HTML', 'CSS', 'Vue.js'],
        }),
      } as JobOffer,
    ]);
  });
});