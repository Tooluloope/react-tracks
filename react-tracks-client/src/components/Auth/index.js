import React, { useState } from "react";

import withRoot from "../../withRoot";
import Register from  "./Register"
import Login from  "./Login"


export default withRoot(() => {

  const [newuser, setNewuser] = useState(true)
  
  return newuser ? (
     <Register setNewuser={setNewuser} /> ) : <Login setNewuser={setNewuser} />
});
