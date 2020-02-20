import React, { useContext } from "react";
import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";
import { UserContext } from "../../Root";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";
import { GET_TRACKS_QUERY } from "../../pages/App";

const DeleteTrack = ({track}) => {

  const currentUser =  useContext(UserContext)
  const isCurrentUser = currentUser.id ===track.postedBy.id
  


  return isCurrentUser && (
    <Mutation mutation={DELETE_TRACK_MUTATION}
    variables={{trackId: track.id}}
    onCompleted = {data => {
      console.log(data)
    }}
    refetchQueries = {() => [{query: GET_TRACKS_QUERY}]}
    >
      {deleteTrack => (
        <IconButton onClick={deleteTrack}>
          <TrashIcon />
        </IconButton>
      )}
    </Mutation>
  )
};

export const DELETE_TRACK_MUTATION = gql`
mutation($trackId:Int!) {
  deleteTrack(trackId: $trackId) {
    trackId
  }
}
`




export default DeleteTrack;
