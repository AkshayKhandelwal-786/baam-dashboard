
// ** Third Party Imports
import DatePicker from 'react-datepicker';
import { useState } from "react";
// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DateType } from "src/types/forms/reactDatepickerTypes";
// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { TextField } from '@mui/material';
import moment from 'moment';
import { getYear, getMonth } from 'date-fns';

// Define a simple range function
const range = (start: number, end: number, step: number = 1): number[] => {
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

const EditableDatePicker = ({
  label,
  value,
  onChange
}: {
  label?: string
  value: any
  onChange(date: any, event: React.SyntheticEvent<any> | undefined): void
}) => {
  // ** States
  const [monthYear, setMonthYear] = useState<DateType>(new Date())

  const years = range(1990, getYear(new Date()) + 1, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <DatePickerWrapper>
      <DatePicker
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div
            style={{
              margin: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              {"<"}
            </button>
            <select
              value={getYear(date)}
              onChange={({ target: { value } }) => changeYear(value as any)}
            >
              {years.map((option: any) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={months[getMonth(date)]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              {">"}
            </button>
          </div>
        )}
        selected={monthYear}
        onChange={(date: any, e: any) => {
          console
          setMonthYear(date)
          onChange(date, e)
        }}
        value={value}
        customInput={<CustomInput label={label} style={{ width: '100%' }} />}
      />
    </DatePickerWrapper>
  )
}

export default EditableDatePicker;
