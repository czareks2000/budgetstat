import React from 'react';
import { NumericFormat } from 'react-number-format';

const NumberFormatCustom = React.forwardRef((props, ref) => {
    const { component: NumbericFormat, ...other } = props;
  
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator=" "
        valueIsNumericString
        prefix=""
      />
    );
  });

export default NumberFormatCustom