import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ThumbUpIcon from "@material-ui/icons/ThumbUpTwoTone";
import AudiotrackIcon from "@material-ui/icons/AudiotrackTwoTone";
import Divider from "@material-ui/core/Divider";
import AudioPlayer from "../components/Shared/AudioPlayer";
import Error from "../components/Shared/Error";
import Loading from "../components/Shared/Loading";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";

const Profile = ({ classes }) => {
  return(
    <Query query = {PROFILE_QUERY}>
      {({data, loading, error}) => {
        if(loading) return <Loading />
        if(error) return <Error error={error} />
        return (
          <div>
            <Card className={classes.card}>
              <CardHeader avatar= {<Avatar>{data.me.username[0]}</Avatar>}
                title = {data.me.username}
                subheader = {`Joined ${data.me.dateJoined}`}
                >
              </CardHeader>
            </Card>
            <Paper elevation={1} className={classes.paper}>
              <Typography variant='title' className={classes.title}>
                <AudiotrackIcon className={classes.audioIcon} />
                Created Tracks
              </Typography>
              {data.me.trackSet.map(track => (
                <div key={track.id}>
                  <Typography>
                    {track.title} . {track.likes.length} likes
                  </Typography>
                  <AudioPlayer url = {track.url} />
                  <Divider className={classes.divider} />
                </div>
              ))}
            </Paper>
            <Paper elevation = {1} className={classes.paper}>
              <Typography variant='title' className={classes.title}>
                <ThumbUpIcon className={classes.thumbIcon} />
                Liked Tracks
              </Typography>
              {data.me.likeSet.map(({track}) => (
                <div key={track.id}>
                  <Typography>
                    {track.title} . {track.likes.length} likes . {" "}
                    {track.postedBy.username}
                  </Typography>
                  <AudioPlayer url={track.url} />
                  <Divider className={classes.divider} />
                </div>
              ))}
            </Paper>
          </div>

          
        )
      }}
    </Query>
  )
};

const PROFILE_QUERY = gql`
  query {
    me{
    id
    username
    dateJoined
    likeSet{
      id
      track{
        id
        title
        description
        url
        likes {
          id
        }
        postedBy{
          id
          username
        }
      }
    }
    trackSet{
      id
      title
      description
      url
      likes{
        id
      }
      
    }
  }
  }
`

const styles = theme => ({
  paper: {
    width: "auto",
    display: "block",
    padding: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    [theme.breakpoints.up("md")]: {
      width: 650,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  card: {
    display: "flex",
    justifyContent: "center"
  },
  title: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing.unit * 2
  },
  audioIcon: {
    color: "purple",
    fontSize: 30,
    marginRight: theme.spacing.unit
  },
  thumbIcon: {
    color: "green",
    marginRight: theme.spacing.unit
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

export default withStyles(styles)(Profile);
