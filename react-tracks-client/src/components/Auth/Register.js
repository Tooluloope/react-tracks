import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Gavel from "@material-ui/icons/Gavel";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import { Mutation } from "react-apollo";
import {gql} from "apollo-boost"
import Error from '../Shared/Error'


function Transition(props) {
  return <Slide direction='up' {...props} />
}

const Register = ({classes, setNewuser}) => {


  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = async(e, creatUser) => {
    e.preventDefault()

    await creatUser({
      variables:{
        username, email, password
      }
    })
    
    
  }

  
return (
  <div className={classes.root}>
    <Paper className={classes.paper}>
      <Avatar className={classes.avatar}>
        <Gavel />
      </Avatar>
      <Typography variant='headline'>
        Registers
      </Typography>
      <Mutation mutation = {REGISTER_MUTATION} onCompleted = { data => {
          
          setOpen(true)
      }}>
          {(createUser, {loading, error}) => {
          return(
            <form className={classes.form} onSubmit={(e) => handleSubmit(e,createUser)}>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='username'>Username</InputLabel>
                <Input id='username' onChange = {(e) => setUsername(e.target.value) } />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='email'>Email</InputLabel>
                <Input id='email' type='email' onChange = {(e) => setEmail(e.target.value) } />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='password'>Password</InputLabel>
                <Input id='password' type='password' onChange = {(e) => setPassword(e.target.value) } />
              </FormControl>
              <Button disabled = {loading || !username.trim() || !email.trim() || !password.trim()}
               className={classes.submit} type='submit' variant='contained'
                color='secondary' fullWidth>
    
                {loading ? "Registering..." : "Register"} 
              </Button>
              <Button onClick={() => setNewuser(false)} 
              type='submit' variant='outlined' 
              color='primary' fullWidth>
                Previous user? Login
              </Button>
              {error && <Error error={error} />}
            </form>
            )
          }}
      </Mutation>
    </Paper>

    <Dialog TransitionComponent = {Transition} open = {open} disableBackdropClick = {true}>

      <DialogTitle>
        <VerifiedUserTwoTone className = {classes.icon} /> 
        New Account
        <DialogContent>
          <DialogContentText>
            User Successfully created
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          
          <Button 
           color='primary' variant='contained' 
           onClick = {() => setNewuser(false)}> Login
           
          </Button>
          
        </DialogActions>
      </DialogTitle>
    </Dialog>
  </div>)

  
};

const styles = theme => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green"
  }
});

const REGISTER_MUTATION = gql`
mutation($username:String!, $email:String!, $password:String!) {
  createUser(username: $username, email: $email, password:$password){
    user{
      username
      email
    }
  }
}
`

export default withStyles(styles)(Register);
