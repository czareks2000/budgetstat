import { InputAdornment, TextField } from "@mui/material";
import { useField } from "formik";
import { observer } from "mobx-react-lite";

interface Props {
    name: string;
    placeholder?: string;
    label?: string;
    adornment?: boolean;
    adornmentPosition?: 'start' | 'end';
    adormentText?: string;
    fullWidth?: boolean;
    helperText?: string;
}

export default observer(function NumberInput(props: Props) {
    const [field, meta] = useField(props.name);

    const InputProps = props.adornment ? 
        (props.adornmentPosition === 'start' ?
            { startAdornment: <InputAdornment position='start'>{props.adormentText}</InputAdornment> }
            :
            { endAdornment: <InputAdornment position='end'>{props.adormentText}</InputAdornment> }
        )
    : {};

    return (
        <>
            <TextField
                fullWidth={props.fullWidth}
                id={field.name}
                {...field} 
                name={props.name}
                placeholder={props.placeholder}
                label={props.label}
                type="number"
                value={field.value === null ? '' : field.value}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error || props.helperText}
                InputProps={InputProps}
                autoComplete='off'
                onWheel={(e) => (e.target as HTMLElement).blur()}
            />
        </>
        
    )
})