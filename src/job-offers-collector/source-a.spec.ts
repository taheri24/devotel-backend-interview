import { Test, TestingModule } from '@nestjs/testing';
import { SourceA } from './source-a';
import { JsonFetcherService } from './json-fetcher.service';
import { JobOffer } from '~/model/job-offer.entity';
import { ExternalSource1 } from './external-source1';
import { Provider } from '@nestjs/common';

describe('SourceA', () => {
  let service: SourceA;
  let jsonFetcherService: JsonFetcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SourceA,
        {
          provide: JsonFetcherService,
          useValue: {
            fetchJson: jest.fn(),
          },
        } as  Provider<JsonFetcherService>,
      ],
    }).compile();

    service = module.get<SourceA>(SourceA);
    jsonFetcherService = module.get<JsonFetcherService>(JsonFetcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and transform data correctly', async () => {
    const mockData: ExternalSource1 = {
      metadata: {
        requestId: '12345',
        timestamp: '2025-02-06T12:00:00Z',
      },
      jobs: [
        {
          jobId: 'job-123',
          title: 'Backend Developer',
          details: {
            location: 'New York',
            type: 'Full-time',
            salaryRange: '70000-90000',
          },
          company: {
            name: 'Tech Corp',
            industry: 'Software',
          },
          skills: ['Node.js', 'TypeScript', 'SQL'],
          postedDate: '2025-02-06',
        },
      ],
    };

    jest.spyOn(jsonFetcherService, 'fetchJson').mockResolvedValue(mockData);

    const result = await service.collect();

    expect(result).toEqual([
      {
        ref: 'job-123',
        title: 'Backend Developer',
        location: 'New York',
        salaryRange: '70000-90000',
        postedDate: '2025-02-06',
        company: 'Tech Corp',
        industry: 'Software',
        skills: 'Node.js, TypeScript, SQL',
      } as JobOffer,
    ]);
  });
});