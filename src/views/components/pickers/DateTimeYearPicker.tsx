// ** React Imports
import { useState } from 'react'

// ** MUI Imports

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'


// ** MUI Imports

// ** Custom Components Imports

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports

// ** Source code imports

const DateTimeYearPicker = ({
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

  return (
    <DatePickerWrapper>
      <DatePicker
        showYearDropdown
        showMonthDropdown
        showTimeSelect
        selected={new Date(value)}
        // selected={monthYear}
        // id='month-year-dropdown'
        dateFormat='yyyy-MM-dd HH:mm:ss'
        timeFormat='HH:mm:ss'
        // placeholderText='MM-DD-YYYY'
        value={value}
        // popperPlacement={popperPlacement}
        onChange={(date, e) => {
          setMonthYear(date)
          onChange(date, e)
        }}
        customInput={<CustomInput label={label} style={{ width: '100%' }} />}
        showTimeInput
      />
    </DatePickerWrapper>
  )
}

export default DateTimeYearPicker
