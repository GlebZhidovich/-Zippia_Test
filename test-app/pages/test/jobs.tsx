import { GetServerSideProps } from 'next';
import React from 'react';
import styles from './jobs.module.scss';

export const getServerSideProps: GetServerSideProps<{ jobsList: any[] }> =
  async () => {
    const body = JSON.stringify({
      companySkills: true,
      dismissedListingHashes: [],
      fetchJobDesc: true,
      jobTitle: 'Business Analyst',
      locations: [],
      numJobs: 20,
      previousListingHashes: [],
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    };
    const jobsList = await (
      await fetch('https://www.zippia.com/api/jobs/', requestOptions)
    ).json();

    return {
      props: {
        jobsList,
      },
    };
  };
type Job = {
  jobTitle: string;
  companyName: string;
  shortDesc: string;
  OBJpostingDate: string;
};

interface JobsProps {
  jobsList: {
    jobs: Job[];
    totalJobs: number;
  };
}

const msecToDays = (msec: number): number => {
  return msec / 86400000;
};

export default function Jobs({ jobsList }: JobsProps) {
  const [jobs, setJobs] = React.useState(jobsList.jobs.slice(0, 10));
  const inputRef = React.useRef<HTMLInputElement>(null);
  const onSearch = () => {
    const { value } = inputRef.current!;
    const res = jobsList.jobs
      .slice(0, 10)
      .filter((job) =>
        job.companyName.toLowerCase().includes(value.trim().toLowerCase()),
      );

    setJobs(res);
  };

  const onFilter = () => {
    setJobs((curJobs) =>
      curJobs.filter((job) => {
        const time = Date.now() - (new Date(job.OBJpostingDate) as any);

        const days = msecToDays(time);
        return days < 7;
      }),
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles['search-container']}>
        <h2>Find The Best Developer Jobs For You</h2>
        <p>Where do you want to work?</p>
        <div className={styles['conrols-search']}>
          <input
            ref={inputRef}
            type="text"
            className={styles['input-search']}
          />
          <button onClick={onSearch} className={styles['btn-search']}>
            Find Jobs
          </button>
          <button onClick={onFilter} className={styles['btn-filter']}>
            Last 7 days
          </button>
        </div>
      </div>
      <ul className={styles['jobs-list']}>
        {jobs.map((job, index) => (
          <li key={'job_' + index} className={styles['jobs-item']}>
            <h3>{job.jobTitle}</h3>
            <p>{job.companyName}</p>
            <p>{job.shortDesc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
