import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useField } from "formik";

interface Props {
    name: string;
    label?: string;
    defaultValue?: dayjs.Dayjs;
}

export default function MyDatePicker(props: Props) {
    const [field, meta, helpers] = useField(props.name);
       
    return (
        <>
            <DatePicker
                label={props.label} 
                value={field.value || props.defaultValue}
                onChange={(date) => helpers.setValue(date, true)}
                format={"DD/MM/YYYY"}
                
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: Boolean(meta.error),
                        helperText: meta.error,
                        name: props.name,
                        onBlur: () => helpers.setTouched(true, true),
                    }
                }}
            />
        </>
        
    )
}