import React, { Component } from 'react';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

// CSS Modules, react-datepicker-cssmodules.css
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class DatePicker extends React.Component {
  constructor (props) {
    super(props)

  }



  render() {
 
    return (
        <div class="form-group">
            <label>{this.props.data.label}</label>
            <ReactDatePicker
            name={this.props.data.label}
            selected={this.props.value}
            onChange={this.props.handleInput}
            />
        </div>
    )
  }
}

export default DatePicker;


