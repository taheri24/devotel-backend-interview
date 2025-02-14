  interface JobDetails {
    location: string;
    type: string;
    salaryRange: string;
  }
  
    interface Company {
    name: string;
    industry: string;
  }
  
    interface Job {
    jobId: string;
    title: string;
    details: JobDetails;
    company: Company;
    skills: string[];
    postedDate: string;
  }
  
  export interface ExternalSource1 {
    metadata: {
      requestId: string;
      timestamp: string;
    };
    jobs: Job[];
  }