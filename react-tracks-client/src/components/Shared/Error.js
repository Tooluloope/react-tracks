import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Snackbar, Button } from "@material-ui/core";
// import Button from "@material-ui/core/Button";
// import Snackbar from "@material-ui/core/Snackbar";

const Error = ({ classes, error }) => {

  const [open, setOpen] = useState(true)
  return (
    <Snackbar open = {open}
    className={classes.snackbar}
     message = {error.message}
    action = {
      <Button onClick = {() => setOpen(false)}
      color='secondary' size='small'>CLOSE</Button>
    }>

    </Snackbar>
  )
};

const styles = theme => ({
  snackbar: {
    margin: theme.spacing.unit
  }
});

export default withStyles(styles)(Error);
