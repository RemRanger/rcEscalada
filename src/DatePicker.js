import React, { Component } from 'react';

class DatePicker extends Component
{
    constructor(props)
    {
        super(props);

        let date = new Date(props.date);
        this.state =
            {
                selectedYear: date.getFullYear(),
                selectedMonth: date.getMonth() + 1,
                selectedDay: date.getDate()
            }

        this.handleChange = this.handleChange.bind(this);
    }

    getYears = () =>
    {
        let years = [];
        for (var year = new Date().getFullYear(); year >= 1990; year--)
            years.push(year);

        return years;
    }

    getMonths = () =>
    {
        let months = [];
        for (var month = 1; month <= 12; month++)
            months.push(month);

        return months;
    }

    getMonthName = (month) =>
    {
        return new Date(2000, month - 1, 1).toLocaleDateString('en-US', { month: 'long' });
    }

    getDays = () =>
    {
        let days = [];
        for (var day = 1; day <= new Date(this.state.selectedYear, this.state.selectedMonth, 0).getDate(); day++)
            days.push(day);

        return days;
    }

    handleChange(event)
    {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });

        let selectedYear = (name === "selectedYear" ? value : this.state.selectedYear);
        let selectedMonth = (name === "selectedMonth" ? value : this.state.selectedMonth);
        let selectedDay = (name === "selectedDay" ? value : this.state.selectedDay);

        this.props.onChange(new Date(selectedYear, selectedMonth, selectedDay));
    }

    render()
    {
        return (
            <div>
                <select name="selectedYear" required onChange={this.handleChange}>
                    {this.getYears().map(y => <option value={y} selected={y == this.state.selectedYear}>{y}</option>)}
                </select >
                <select name="selectedMonth" required onChange={this.handleChange}>
                    {this.getMonths().map(m => <option value={m} selected={m == this.state.selectedMonth}>{this.getMonthName(m)}</option>)}
                </select >
                <select name="selectedDay" onChange={this.handleChange}>
                    {this.getDays().map(d => <option value={d} selected={d == this.state.selectedDay} >{d}</option>)}
                </select >
            </div >
        )
    }
}

export default DatePicker