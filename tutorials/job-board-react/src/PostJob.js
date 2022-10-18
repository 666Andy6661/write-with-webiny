import { useState } from "react"
import Input from "./Input"
import Select from "./Select"
import { gql, useMutation } from '@apollo/client';


const POST_JOB = gql`
  mutation CreateJob(
    $title: String
    $description: String
    $type: String
    $station: String
    $level: String
  ){ 
  createJob(data: {
    title: $title
    description: $description
    type: $type
    station: $station
    level: $level
  }) {
    data {
      id
    } 
  }
}`

const PUBLISH_JOB = gql`
mutation PublishJob($revision: ID!) {
  publishJob(revision: $revision) {
    data {
      id
    }
  }
}
`
function PostJob({jobLevelOptions, jobTypeOptions, jobStationOptions, closeModal, queryToRefresh}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [jobType, setJobType] = useState('')
  const [jobStation, setJobStation] = useState('')
  const [jobLevel, setJobLevel] = useState('')
  const [openSelect, setOpenSelect] = useState({
    jobLevel: false, 
    jobType: false, 
    jobStation: false
  })
  
  const [postJob, { loading }] = useMutation(POST_JOB, {
  context: {endpointType: 'manage'},
  refetchQueries: [
    {query: queryToRefresh}
  ],
});

  const [publishJob] = useMutation(PUBLISH_JOB, {
  context: {endpointType: 'manage'}
})

  const handleSubmit = (e) => {
    e.preventDefault();
    postJob({ variables: {
      title,
      description,
      type: jobType,
      station: jobStation,
      level: jobLevel
    }}).then(({data}) => {
      publishJob({
        variables: {
          revision: data.createJob.data.id
        }
      })
      closeModal()
    })
  }

  return (
    <form name='postJob' className="postJob" onSubmit={handleSubmit} >
        <Input
          label='Job title'
          required={true}
          value={title}
          setValue={(e) => setTitle(e.target.value)}
        />

        <div className="postJob__description">
          <label htmlFor="desc">Job decscription</label>
          <textarea
            id='desc'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="postJob__selects">
          <Select
            text='Job Level'
            replaceText={jobLevel}
            open={openSelect.jobLevel}
            toggleSelect = {
              () => setOpenSelect({...openSelect, jobLevel: !openSelect.jobLevel})
            }
          >
            {jobLevelOptions.map((option) => (
              <span 
                key={option}
                className="postJob__option"
                onClick={() => {
                  setJobLevel(option)
                  setOpenSelect({...openSelect, jobLevel: !openSelect.jobLevel})
                }}
              >
                {option}
              </span>
            ))}
          </Select>

          <Select
            text='Job Station'
            replaceText={jobStation}
            open={openSelect.jobStation}
            toggleSelect = {
              () => setOpenSelect({...openSelect, jobStation: !openSelect.jobStation})
            }
          >
            {jobStationOptions.map((option) => (
              <span 
                key={option}
                className="postJob__option" 
                onClick={() => {
                  setJobStation(option)
                  setOpenSelect({...openSelect, jobStation: !openSelect.jobStation})
                }}
              >
                {option}
              </span>
            ))}
          </Select>

          <Select
            text='Job Type'
            replaceText={jobType}
            open={openSelect.jobType}
            toggleSelect = {
              () => setOpenSelect({...openSelect, jobType: !openSelect.jobType})
            }
          >
            {jobTypeOptions.map((option) => (
              <span 
                key={option}
                className="postJob__option"
                onClick={() => {
                  setJobType(option)
                  setOpenSelect({...openSelect, jobType: !openSelect.jobType})
                }}
              >
                {option}
              </span>
            ))}
          </Select>
          
        </div>
        <button>Post</button>
      </form>
)
}

export default PostJob