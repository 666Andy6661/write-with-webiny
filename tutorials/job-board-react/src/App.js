import './styles.css';
import Hero from './Hero';
import { useState } from 'react';
import JobCard from './JobCard';
import { gql, useQuery } from '@apollo/client';
import {useEffect} from 'react'
const LIST_JOBS = gql`
  {
    listJobs {
      data {
        id
        title
        description
        type
        station
        level
      }
    }
  }
  `
function App() {
  const [searchValue, setSearchValue] = useState('')
  const [jobLevel, setJobLevel] = useState([])
  const [jobType, setJobType] = useState([])
  const [jobStation, setJobStation] = useState([])
  
  const {data} = useQuery(LIST_JOBS)
  const [filteredJobs, setFilteredJobs] = useState([])

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = data.listJobs.data.filter((job) => 
      job.title.toLowerCase().includes(searchValue.toLowerCase())
    )
    setFilteredJobs(filtered)
  }

  useEffect(() => {
    if(data){
      setFilteredJobs(data.listJobs.data)
    }
  }, [data])
  useEffect(() => {
    if(data) {
      let filtered = data.listJobs.data
      // for jobLevel select
      if(jobLevel.length) {
        filtered = filtered.filter((job) => 
          jobLevel.includes(job.level)
        )
      }
      // for jobStation select
      if(jobStation.length) {
        filtered = filtered.filter((job) => 
          jobStation.includes(job.station)
        )
      }
      // for jobType select
      if(jobType.length) {
        filtered = filtered.filter((job) => 
          jobType.includes(job.type)
        )
      }
      setFilteredJobs(filtered)
    }
  }, [jobType, jobStation, jobLevel, data])
  return (
    <div className="app">
      <Hero 
        searchValue={searchValue}
        setSearchValue = {setSearchValue}
        jobLevel={jobLevel}
        setJobLevel={setJobLevel}
        jobStation={jobStation}
        setJobStation={setJobStation}
        jobType={jobType}
        setJobType={setJobType}
        queryToRefresh={LIST_JOBS}
        onSearch={handleSearch}
      />
      <div className='jobs wrapper'>
      {filteredJobs.map((job) => (
        <JobCard 
          key={job.id}
          id={job.id}
          title={job.title}
          station={job.station}
          type={job.type}
          level={job.level}
          description={job.description}
        />
  ))}
</div>
    </div>
  );
}

export default App;
