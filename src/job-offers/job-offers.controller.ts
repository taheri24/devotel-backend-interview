import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Query, Res } from '@nestjs/common';
import { JobOffersService } from './job-offers.service';
import { JobOffer } from '~/model/job-offer.entity';
import { Response } from 'express';
const validInteger = (s: string) => {
    if (!s) return 0;
    const n = parseInt(s, 10);
    if (isNaN(n)) throw new Error(`invalid number`);
    return n
}
@Controller('job-offers')
export class JobOffersController {
    constructor(private readonly jobOffersService: JobOffersService) { }

    @Get()
    async getJobs(@Query('skip', { transform: validInteger }) skip: number,
        @Query('pageNo', { transform: validInteger }) take: number,
        @Res() res: Response): Promise<void> {
        take = take || 10;
        const [list, count] = await this.jobOffersService.getJobsWithPaginate(skip, take);
        res.setHeader('X-Total-Count', count);
        res.json(list);
    }

    @Post()
    createJob(@Body() jobOffer: JobOffer): Promise<JobOffer> {
               
        return this.jobOffersService.createJob(jobOffer);
    }

    @Get(':id')
    async getJob(@Param('id') id: string): Promise<JobOffer> {
        const jobOffer = await this.jobOffersService.getJob(id);
        if (!jobOffer) {
            throw new NotFoundException(`Job offer not found with ID ${id}`);
        }

        return jobOffer;
    }

    @Put(':id')
    async updateJob(@Param('id') id: string, @Body() jobOffer: JobOffer): Promise<JobOffer> {
        return this.jobOffersService.updateJob(id, jobOffer);
    }

    @Delete(':id')
    deleteJob(@Param('id') id: string): void {
        this.jobOffersService.deleteJob(id);
    }

    @Post('trigger-cron')
    async triggerCron() {
        await this.jobOffersService.triggerCron();
        return { message: 'Cron job triggered' };
    }
}
