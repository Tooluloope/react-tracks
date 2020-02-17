import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import SearchTracks from "../components/Track/SearchTracks";
import TrackList from "../components/Track/TrackList";
import CreateTrack from "../components/Track/CreateTrack";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";
import {Query} from 'react-apollo';
import { gql } from "apollo-boost";


const App = ({ classes }) => {
  return(
    <div className = {classes.container}>
      <SearchTracks />
      <CreateTrack />
      <Query query={GET_TRACKS_QUERY}>
        {({data, loading, error}) => {
          if (loading) return <Loading />
          if (error) return <Error error={error} />

          return <TrackList tracks ={data.tracks} />

        }}

      </Query>
    </div>  
  )
};

export const GET_TRACKS_QUERY = gql`
  query getTracksQuery {
    tracks {
      id
      title
      description
      url
      likes{
        id
      }
      postedBy {
        id
        username
      }
    }
  }
`

const styles = theme => ({
  container: {
    margin: "0 auto",
    maxWidth: 960,
    padding: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(App);
