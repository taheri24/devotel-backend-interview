import { Controller, Get, Post } from '@nestjs/common';
import { JobOffersService } from './job-offers.service';
import { JobOffer } from '~/model/job-offer.entity';

@Controller('job-offers')
export class JobOffersController {
    constructor(private readonly jobOffersService: JobOffersService) {}
    @Get()
    getHello(): Array<JobOffer> {
        return [];
      }
    @Post('trigger-cron')
    async triggerCron() {
        await this.jobOffersService.triggerCron();
        return { message: 'Cron job triggered' };
    }
}
