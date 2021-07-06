import {
  Button,
  TextField,
  Toolbar,
  Typography,
  makeStyles
} from "@material-ui/core";
import { 
  ArrowLeft,
  ArrowRight,
  CalendarToday,
  EventAvailable
} from "@material-ui/icons";
import { 
  Fragment, 
  useReducer,
  useState
} from "react";

import { actions, initializer, reducer } from "./weekReducer";

const useStyles = makeStyles(theme => ({
  spacer: {
    flexGrow: 1
  }
}));

export default function WeekPicker({ date }) {
  const classes = useStyles();
  const [ week, dispatch ] = useReducer(reducer, date, initializer);
  const [ dateText, setDateText ] = useState(null);

  const nextWeek = () => dispatch(actions.nextWeek());
  const previousWeek = () => dispatch(actions.previousWeek());
  const setDate = () => dispatch(actions.setDate(new Date(dateText)));
  const today = () => dispatch(actions.today());

  return (
    <Fragment>
      <Toolbar>
        <Button variant="outlined" color="primary" startIcon={ <ArrowLeft /> } onClick={ previousWeek }>Prev</Button>
        <Button variant="outlined" color="primary" startIcon={ <CalendarToday /> } onClick={ today }>Today</Button>
        <Typography className={ classes.spacer } component="div" />
        <TextField value={ dateText } placeholder="e.g. 2021-07-06" 
            onChange={ (event) => setDateText(event.target.value) } />
        <Button color="primary" startIcon={ <EventAvailable /> } onClick={ setDate }>Go</Button>
        <Typography className={ classes.spacer } component="div"/>
        <Button variant="outlined" color="primary" endIcon={ <ArrowRight /> } onClick={ nextWeek }>Next</Button>
      </Toolbar>
      <Typography variant="body1" component="p" align="center">
        { week.start.toDateString() } - { week.end.toDateString() }
      </Typography>
    </Fragment> 
  );
};