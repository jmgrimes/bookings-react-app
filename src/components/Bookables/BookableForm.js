import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    TextField,
    makeStyles
} from "@material-ui/core";
import {
    Cancel,
    Delete,
    Save
} from "@material-ui/icons";
import {
    useEffect,
    useMemo
} from "react";
import {
    useController, 
    useForm
} from "react-hook-form"
import {
    dayNames, 
    sessionNames
} from "../../static.json";

const toBookable = (values) => {
    const bookable = {
        ...values,
        days: values.days.filter(day => day.active).map(day => day.id),
        sessions: values.sessions.filter(session => session.active).map(session => session.id)
    };
    if (!bookable.id) delete bookable.id;
    return bookable
};

const fromBookable = (bookable) => {
    const {days = [], sessions = []} = bookable;
    return {
        id: bookable.id || "",
        title: bookable.title || "",
        group: bookable.group || "",
        notes: bookable.notes || "",
        days: dayNames.map((_, id) => ({
            id,
            active: days.indexOf(id) !== -1
        })),
        sessions: sessionNames.map((_, id) => ({
            id,
            active: sessions.indexOf(id) !== -1
        }))
    };
};

const useStyles = makeStyles(() => ({
    flexSpacer: {
        flexGrow: 1
    },
    sectionLabel: {
        marginBottom: 10
    },
    textField: {
        marginBottom: 10
    }
}));

const CollectionCheckbox = ({register, control, id, name, label}) => {
    const idField = register(`${name}.${id}.id`, {valueAsNumber: true});
    const {field: activeField} = useController({control, name: `${name}.${id}.active`});
    return (
        <>
            <input type="hidden" {...idField}/>
            <FormControlLabel 
                label={label}
                control={
                    <Checkbox 
                        key={activeField.name}
                        name={activeField.name}
                        checked={activeField.value} 
                        onChange={event => activeField.onChange(event.target.checked)}
                    />
                }
            />
        </>
    );
}

const BookableForm = ({bookable, onCancel, onDelete, onSave}) => {
    const classes = useStyles();

    const defaultValues = useMemo(
        () => fromBookable(bookable), 
        [bookable]
    );
    
    const {control, handleSubmit, register, reset} = useForm({defaultValues});
    const idField = register("id", {valueAsNumber: true});
    const {field: titleField, fieldState: titleFieldState } = useController({
        control, 
        name: "title", 
        rules: {
            required: true
        }
    });
    const {field: groupField, fieldState: groupFieldState } = useController({
        control, 
        name: "group", 
        rules: {
            required: true
        }
    });
    const {field: notesField, fieldState: notesFieldState } = useController({
        control, 
        name: "notes", 
        rules: {
            required: true
        }
    });
    const titleError = titleFieldState.error?.type === "required" ? "Title is required." : null;
    const groupError = groupFieldState.error?.type === "required" ? "Group is required." : null;
    const notesError = notesFieldState.error?.type === "required" ? "Notes is required" : null;

    const _cancel = () => {
        onCancel(bookable);
    }

    const _delete = () => {
        onDelete(bookable);
    }

    const _save = handleSubmit((values) => {
        const bookable = toBookable(values);
        onSave(bookable);
    });

    useEffect(
        () => reset(fromBookable(bookable)),
        [bookable, reset]
    );

    return (
        <Card>
            <CardHeader title={onDelete ? "Edit Bookable" : "New Bookable"}/>
            <CardContent>
                <input type="hidden" {...idField}/>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <FormLabel component="legend" className={classes.sectionLabel}>Details</FormLabel>
                        <TextField fullWidth 
                                   label="Title" 
                                   className={classes.textField} 
                                   error={titleFieldState.invalid}
                                   helperText={titleError}
                                   {...titleField}/>
                        <TextField fullWidth 
                                   label="Group" 
                                   className={classes.textField} 
                                   error={groupFieldState.invalid}
                                   helperText={groupError}
                                   {...groupField}/>
                        <TextField fullWidth 
                                   multiline 
                                   label="Notes" 
                                   className={classes.textField} 
                                   error={notesFieldState.invalid}
                                   helperText={notesError}
                                   {...notesField}/>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" className={classes.sectionLabel}>Days</FormLabel>
                            <FormGroup>
                                { 
                                    dayNames.map((day, id) =>
                                        <CollectionCheckbox register={register}
                                                            control={control}
                                                            label={day}
                                                            id={id}
                                                            name="days"
                                                            key={`days.${id}`}/>
                                    )
                                }
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" className={classes.sectionLabel}>Sessions</FormLabel>
                            <FormGroup>
                                { 
                                    sessionNames.map((session, id) =>
                                        <CollectionCheckbox register={register}
                                                            control={control}
                                                            label={session}
                                                            id={id}
                                                            name="sessions"
                                                            key={`sessions.${id}`}/>
                                    )
                                }
                            </FormGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <div className={classes.flexSpacer}/>
                <Button variant="contained" color="primary" startIcon={<Save/>} onClick={_save}>Save</Button>
                { 
                    onDelete && 
                    <Button variant="contained" color="secondary" startIcon={<Delete/>} onClick={_delete}>
                        Delete
                    </Button> 
                }
                <Button variant="contained" startIcon={<Cancel/>} onClick={_cancel}>Cancel</Button>
                <div className={classes.flexSpacer}/>
            </CardActions>
        </Card>
    );
};

export default BookableForm;