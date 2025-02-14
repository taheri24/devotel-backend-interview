import { Entity, Column, PrimaryGeneratedColumn, BeforeUpdate, BeforeInsert } from 'typeorm';

@Entity({ name: 'job_offers' })
export class JobOffer {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  ref: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column()
  salaryRange: string;
  @Column()

  postedDate: string

  @Column({nullable:true})
  industry: string;
  
  @Column({nullable:true})
  source: string;
  
  @Column()
  skills: string;

  @Column({nullable:true})
  path: string;

  @BeforeInsert()
  @BeforeUpdate()
  updatePath() {
    this.path=this.GetPath()
  }
  GetPath():string{
    return  [this.title,this.company,this.location,this.postedDate].join('|');
  }
  constructor(partial: Partial<JobOffer>) {
    Object.assign(this, partial);
  }
}
