import React from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDatePicker,
  DatePicker,
} from "@material-ui/pickers";
const DateTimePicker = ({
  onlyDate = false,
  onChange,
  disablePast,
  ...props
}) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {onlyDate ? (
        <DatePicker onChange={onChange} {...props} />
      ) : (
        <KeyboardDateTimePicker
          {...props}
          id="time-picker"
          label="Setup your schedule"
          onChange={onChange}
          disablePast={disablePast}
        />
      )}
    </MuiPickersUtilsProvider>
  );
};

export default DateTimePicker;
