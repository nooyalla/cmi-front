import React, { Component } from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { Grid, TextField } from '@material-ui/core';

function addHours(date, h) {
    const hour = typeof h === 'string' ? parseInt(h): h;
    const newDate = new Date(date);
    newDate.setTime(newDate.getTime() + (hour * 60 * 60 * 1000));
    return newDate;
}

class NewEventForm extends Component {

    constructor(props) {
        super(props);
        const event = props.event || {
            title: '',
            description: '',
            location: '',
            startDate: new Date(),
            startDateTime: new Date(),
            endDate: null,
            lastConfirmationDate: null,
            imageUrl: null,
            minParticipants: 2,
            maxParticipants: 8,
            additionalItems: null,

        };

        this.state = {
            error: null,
            duration: 4,
            timer: 2,
            event,
            update: Boolean(event.id)
        };
    }

    handleEventItemChange = (attributeName, newValue) => {
        const event = { ...this.state.event, [attributeName]: newValue };
        this.setState({ event });
    };

    handleStartDateChange = (startDate) => {
        const event = { ...this.state.event, startDate };
        this.setState({ event });
    };

    handleStartDateTimeChange = (startDateTime) => {
        const event = { ...this.state.event, startDateTime };
        this.setState({ event });
    };

    getHeader = () => {
        return <div id="app-header">
            <span id="app-header-text">IMIN</span>
        </div>
    }


    getDateByDateAndTime = (date, hours, minutes) => {
        return new Date(`${date} ${hours}:${minutes}:00`);
    }

    publishOrUpdate = () => {
        const endDate = addHours(this.state.event.startDate, this.state.duration);
        const lastConfirmationDate = addHours((new Date()), this.state.timer);
        const serializedStartDate = this.getDateByDateAndTime(
            this.state.event.startDate.toISOString().split('T')[0],
            this.state.event.startDateTime.getHours(),
            this.state.event.startDateTime.getMinutes(),
        );

        const event = {
            title: this.state.event.title,
            description: this.state.event.description,
            location: this.state.event.location,
            startDate: serializedStartDate,
            endDate,
            lastConfirmationDate,
            imageUrl: null,
            minParticipants: parseInt(this.state.event.minParticipants),
            maxParticipants: parseInt(this.state.event.maxParticipants),
            additionalItems: null
        };

        if (this.state.update){
            event.id = this.state.event.id;
            console.log('form update, event:', event);
            this.props.update(event);
        } else {
            console.log('form publish, event:', event);
            this.props.publish(event);
        }

    }


    render() {
        const header = this.getHeader();

        const forLegal = this.state.event.title.length > 0 && this.state.event.location.length > 0 && this.state.event.startDate && this.state.event.minParticipants <= this.state.event.maxParticipants;

        return (
            <div id="create-event-form container">
                {header}
                <div id="create-event-form-wrapper">
                    <div className="row">
                        <span className="new-event-form-item-label">Title*</span>
                    </div>
                    <div className="row">
                        <input type="text" placeholder="Enter event name" id="newEventTitle" className="formTextInput-full-width" value={this.state.event.title} onChange={(e) => this.handleEventItemChange('title', e.target.value)} />
                    </div>
                    <div className="row">
                        <span className="new-event-form-item-label">Description</span>
                    </div>
                    <div className="row">
                        <input type="text" placeholder="Enter description" id="newEventTitle" className="formTextInput-full-width" value={this.state.event.description} onChange={(e) => this.handleEventItemChange('description', e.target.value)} />
                    </div>
                    <div className="row">
                        <div className="col-xs-5">
                            <span className="new-event-form-item-label">Min Participants</span>
                        </div>
                        <div className="col-xs-1">
                            <span className="white">________</span>
                        </div>
                        <div className="col-xs-5">
                            <span className="new-event-form-item-label">Max Participants</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-5">
                            <input type="number" min="1" max="1000" className="formNumberInput-half-width" value={this.state.event.minParticipants} onChange={(e) => this.handleEventItemChange('minParticipants', e.target.value)} />
                        </div>
                        <div className="col-xs-1">
                            <span className="white">_______</span>
                        </div>
                        <div className="col-xs-5">
                            <input type="number" min={this.state.event.minParticipants} max="1000" className="formNumberInput-half-width" value={this.state.event.maxParticipants} onChange={(e) => this.handleEventItemChange('maxParticipants', e.target.value)} />
                        </div>
                    </div>
                    <div className="row">
                        <span className="new-event-form-item-label">Location</span>
                    </div>
                    <div className="row">
                        <input type="text" placeholder="Enter event location" id="newEventTitle" className="formTextInput-full-width locationInput" value={this.state.event.location} onChange={(e) => this.handleEventItemChange('location', e.target.value)} />
                    </div>

                    <div className="row">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-between" alignItems='baseline'>
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Date"
                                    format="MM/dd/yyyy"
                                    value={this.state.event.startDate}
                                    onChange={this.handleStartDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    style={{ width: '40%' }}
                                    a />
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    label="Time"
                                    value={this.state.event.startDateTime}
                                    onChange={this.handleStartDateTimeChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                    style={{ width: '40%' }}
                                />
                                <TextField
                                    id="standard-number"
                                    label="Duration"
                                    type="number"
                                    value={this.state.duration}
                                    onChange={(e) => this.setState({ duration: e.target.value })}
                                    style={{ width: '10%' }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>

                    </div>
                    {!this.state.update && <div className="row">
                        <TextField
                            id="standard-number"
                            label="Timer"
                            type="number"
                            value={this.state.timer}
                            onChange={(e) => this.setState({ timer: e.target.value })}
                        />
                    </div>}
                    <div className="row top-margin">
                        <button className="publish-button" onClick={this.publishOrUpdate} disabled={!forLegal}>{this.state.update ? 'UPDATE' : 'PUBLISH'}</button>
                    </div>
                    {this.state.update ? (<div className="row">
                        <button className="delete-button" onClick={() => this.props.share(this.state.event.id)} >DELETE</button>

                    </div>) : <div />}
                    {this.state.update ? (<div id="event-link">
                        <a href={`https://im-in.herokuapp.com?eventId=${this.state.event.id}`} > open event </a>
                    </div>) : <div />}



                </div>
            </div>
        );

    }
}

export default NewEventForm;

