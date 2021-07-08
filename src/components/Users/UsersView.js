import { Grid } from "@material-ui/core";
import { useState } from "react";

import UserDetails from "./UserDetails";
import UsersList from "./UsersList";

export default function UsersView() {
  const [ user, setUser ] = useState();

  return (
    <Grid container spacing={ 3 }>
      <Grid item xs={ 3 }>
        <UsersList user={ user } setUser={ setUser } />
      </Grid>
      <Grid item xs={ 9 }>
        <UserDetails user={ user } />
      </Grid>
    </Grid>
  );
};