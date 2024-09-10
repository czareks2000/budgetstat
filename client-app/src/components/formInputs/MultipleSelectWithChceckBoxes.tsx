import { Autocomplete, Checkbox, Chip, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Option } from "../../app/models/Option";
import { truncateString } from "../../app/utils/TruncateString";

interface Props {
    name: string;
    placeholder?: string;
    label?: string;
    options: Option[];
    limitTags?: number;
}

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

export default function MultipleSelectWithChceckBoxes(props: Props) {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(props.name);

    const handleChange = (_: any, value: Option[]) => {
        setFieldValue(field.name, value);
    };

    const {limitTags, ...restprops} = props;

    return (
        <>
            <Autocomplete
                id={field.name}
                {...field}
                multiple
                disableCloseOnSelect
                onChange={handleChange}
                options={props.options}
                getOptionLabel={(option) => option.text}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderTags={(value, getTagProps) => {
                    const numTags = value.length;
                    const limitTags = props.limitTags || 1;

                    return (
                      <>
                        {value.slice(0, limitTags).map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={index}
                            label={truncateString(option.text, 13)}
                          />
                        ))}
            
                        {numTags > limitTags && ` +${numTags - limitTags}`}
                      </>
                    );
                  }}
                renderOption={(prop, option, { selected }) => {
                    const { key, ...optionProps } = prop as { key: string; [key: string]: any };
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.text}
                      </li>
                    );
                  }}
                renderInput={(params) => 
                <TextField
                    {...restprops}
                    {...params}
                    slotProps={{ 
                      inputLabel: { shrink: true }, 
                      htmlInput: {...params.inputProps, readOnly: true},
                    }}
                    placeholder={field.value.length > 0 ? "" : props.placeholder}
                    value={field.value}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                    autoComplete='off'/>}
            />
        </>
    )
}