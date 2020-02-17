import React, { useState } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";
import Error from '../Shared/Error'
import Axios from 'axios'
import Loading from "../Shared/Loading";
import {GET_TRACKS_QUERY} from '../../pages/App'

const CreateTrack = ({ classes }) => {

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState('')
  const [submitting, setSubmitting] = useState(false)


  const handleAudioChange = e => {
    const file = e.target.files[0]
    setFile(file)
  }

  const handleAudioUpload= async() => {
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('resource_type', 'raw')
      data.append('upload_preset', 'reacttracks')
      data.append('cloud_name', 'dn1b66xo5')
      const res = await Axios.post('https://api.cloudinary.com/v1_1/dn1b66xo5/raw/upload', data)
      return res.data.url
      
    } catch (error) {
      console.error('Error uploading file', error)
      setSubmitting(false)
    }
   
  }

  const handleSubmit =async (e, createTrack) => {
    e.preventDefault()
    setSubmitting(true)
    const uploadedUrl = await handleAudioUpload()
    createTrack({variables: {title, description, url: uploadedUrl}})

  }
  
  return(
    <>
      <Button onClick = {(e) => setOpen(true)} variant='fab' className={classes.fab} color="secondary">
       {open ? <ClearIcon /> : <AddIcon />}    
      </Button>

      <Mutation mutation={CREATE_TRACK_MUTATION} onCompleted= {data => {
        console.log(data)
        setSubmitting(false)
        setOpen(false)
        setTitle('')
        setDescription('')
        setFile('')

      }}
      refetchQueries={() => [{query: GET_TRACKS_QUERY}]}
      >
        {(createTrack, {loading, error}) => {
          if(error) return <Error error={error} />
          return(
            
       

        <Dialog open={open} className={classes.dialog}>
          <form onSubmit ={e => handleSubmit(e, createTrack)}>
            <DialogTitle>Create Track</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Add a Title, Decription and Audio File
              </DialogContentText>
              <FormControl fullWidth>
                <TextField value={title} onChange={e => setTitle(e.target.value)}  label='Title' placeholder='Add Title' className={classes.textField} />
              </FormControl>
              <FormControl fullWidth>
                <TextField  value={description} onChange={e => setDescription(e.target.value)} multiline  rows ='4' label='Description' placeholder='Add Description' className={classes.textField} />
              </FormControl>
              <FormControl fullWidth>
                <input  onChange={handleAudioChange} accept="audio/mp3, audio/wav" id='audio' type='file' className={classes.input} />
                <label htmlFor = 'audio'>
                  <Button variant='outlined'color={file ? 'secondary' : "inherit"} component="span" className={classes.button} >
                  Audio File <LibraryMusicIcon className = {classes.icon} />
                  </Button>
                  {file && file.name}
                </label>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button disabled={submitting} onClick = {(e) => setOpen(false)} className={classes.cancel}> 
                Cancel
              </Button>
              <Button disabled={ submitting || !title.trim() || !description.trim() || !file} type='submit' className={classes.save}>
                {submitting ? <CircularProgress className={classes.save} size={24} /> : "Add Track"}
              </Button>
            </DialogActions>
          </form>

        </Dialog>
           )
          }}
      </Mutation>
    </>
  )
};


const CREATE_TRACK_MUTATION = gql`
  mutation($title: String!, $description: String!, $url:String!) {
    createTrack(title:$title, description:$description, url:$url) {
      track{
        id
        title
        description
        url
      }
    }
  }
`

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550
  },
  textField: {
    margin: theme.spacing.unit
  },
  cancel: {
    color: "red"
  },
  save: {
    color: "green"
  },
  button: {
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  }
});

export default withStyles(styles)(CreateTrack);
