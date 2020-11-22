import React from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
const DateTimePicker = ({ onChange, disablePast, ...props }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDateTimePicker
        {...props}
        id="time-picker"
        label="Setup your schedule"
        onChange={onChange}
        disablePast={disablePast}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateTimePicker;
