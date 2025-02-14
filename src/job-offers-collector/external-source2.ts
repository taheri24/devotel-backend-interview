export interface Location {
    city: string;
    state: string;
    remote: boolean;
  }
  
    interface Compensation {
    min: number;
    max: number;
    currency: string;
  }
  
    interface Employer {
    companyName: string;
    website: string;
  }
  
    interface Requirements {
    experience: number;
    technologies: string[];
  }
  
    interface Job {
    position: string;
    location: Location;
    compensation: Compensation;
    employer: Employer;
    requirements: Requirements;
    datePosted: string;
  }
   
  
  export interface ExternalSource2 {
    status: string;
    data:  {jobsList: Record<string,Job>};
  }
  const symboByCurrency: Record<string, string> = {
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "JPY": "¥",
    "AUD": "A$",
    "CAD": "C$",
    "CHF": "CHF",
    "CNY": "¥",
    "SEK": "kr",
    "NZD": "NZ$"
};
  export function compensation2String(c:Compensation):string{
    // return $60k - $139k
    const symbol = symboByCurrency[c.currency] || c.currency;
    return `${symbol}${c.min} - ${symbol}${c.max}`;
  }