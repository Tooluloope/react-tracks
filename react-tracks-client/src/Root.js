import React, { createContext } from "react";
import withRoot from "./withRoot";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {Query} from 'react-apollo';
import {gql} from 'apollo-boost'
import App from './pages/App'
import Profile from './pages/Profile'
import Header from './components/Shared/Header'
import Loading from './components/Shared/Loading'
import Error from './components/Shared/Error'


export const UserContext = createContext()


const Root = () =>(
    <Query query={ME_QUERY} fetchPolicy='cache-and-network'>
        {({data, loading, error}) => {
            if(loading) return <Loading />
            if(error) return <Error error={error} />
            const currentUser = data.me

            return(
                <Router >
                    <UserContext.Provider value= {currentUser}>
                        <Header user = {currentUser} />
                        <Switch>
                            <Route exact path='/' component={App} />
                            <Route path='/profile/:id' component={Profile} />
                        </Switch>
                    </UserContext.Provider>
                </Router>
            )
        }}


    </Query>
)
export const ME_QUERY = gql`
{
    me{
        username
        id
        email
        likeSet{
            track{
                id
            }
        }
    }
}
`

// const GET_TRACKS_QUERY = gql`
// {
//     tracks{
//         id
//         title
//     }
// }
// `

export default withRoot(Root);
