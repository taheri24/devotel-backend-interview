import { Test, TestingModule } from '@nestjs/testing';
import { JsonFetcherService } from './json-fetcher.service';

describe('JobOffersFetcherService', () => {
  let service: JsonFetcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonFetcherService],
    }).compile();

    service = module.get<JsonFetcherService>(JsonFetcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
