import React, { Component } from 'react';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

// CSS Modules, react-datepicker-cssmodules.css
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const DatePicker = (props) => {
    console.log(props)
    return (
        <div class="form-group">
            <h4>{props.data.label}</h4>
            <ReactDatePicker
            name={props.data.label}
            selected={moment(props.data.value)}
            />
        </div>
    )
}


export default DatePicker;


