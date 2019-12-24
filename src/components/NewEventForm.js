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
    const hour = typeof h === 'string' ? parseInt(h,10): h;
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
            endDate: null,
            lastConfirmationDate: null,
            imageUrl: null,
            minParticipants: 2,
            maxParticipants: 8,
            additionalItems: '',

        };

        event.additionalItems = props.event  && props.event.additionalItems && Array.isArray(props.event.additionalItems) && props.event.additionalItems.length>0 ? props.event.additionalItems.join(',') : '';
        const duration = props.event && props.event.endDate ?  Math.floor((props.event.endDate.getTime() - props.event.startDate.getTime())/(1000*60*60)) : 4;
        const startDateTime = props.event ? props.event.startDate : new Date();
        this.state = {
            error: null,
            duration,
            timer: 2,
            startDateTime,
            event,
            update: Boolean(event.id)
        };
    }

    handleEventItemChange = (attributeName, newValue) => {
        const event = { ...this.state.event, [attributeName]: newValue };
        this.setState({ event });
    };



    handleStartDateTimeChange = (startDateTime) => {
        this.setState({ startDateTime });
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
            this.state.startDateTime.getHours(),
            this.state.startDateTime.getMinutes(),
        );
        const event = {
            title: this.state.event.title,
            description: this.state.event.description,
            location: this.state.event.location,
            startDate: serializedStartDate,
            endDate,
            lastConfirmationDate,
            imageUrl: null,
            minParticipants: parseInt(this.state.event.minParticipants,10),
            maxParticipants: parseInt(this.state.event.maxParticipants,10),
            additionalItems: this.state.event.additionalItems.split(',')
        };

        if (this.state.update){
            event.id = this.state.event.id;
            this.props.update(event);
        } else {
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
                        <input type="text" placeholder="Enter description" id="newEventDescription" className="formTextInput-full-width" value={this.state.event.description} onChange={(e) => this.handleEventItemChange('description', e.target.value)} />
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
                        <span className="new-event-form-item-label">Location*</span>
                    </div>
                    <div className="row">
                        <input type="text" placeholder="Enter event location" id="newEventLocation" className="formTextInput-full-width locationInput" value={this.state.event.location} onChange={(e) => this.handleEventItemChange('location', e.target.value)} />
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
                                    onChange={(date) => this.handleEventItemChange('startDate',date)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    style={{ width: '40%' }}
                                     />
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    label="Time"
                                    value={this.state.startDateTime}
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
                    {!this.state.update &&
                    <div className="row">
                        <span className="new-event-form-item-label small-top-margin">Timer</span>
                    </div>}
                    {!this.state.update && <div className="row">
                        <TextField className="formNumberInput-full-width"
                            id="standard-number"
                            type="number"
                            value={this.state.timer}
                            onChange={(e) => this.setState({ timer: e.target.value })}
                        />
                    </div>}

                    {/*<div className="row">*/}
                    {/*    <span className="new-event-form-item-label small-top-margin">Additional Items</span>*/}
                    {/*</div>*/}
                    {/*<div className="row">*/}
                    {/*    <input type="text" placeholder="items to bring" id="additionalItems" className="formTextInput-full-width" value={this.state.event.additionalItems} onChange={(e) => this.handleEventItemChange('additionalItems', e.target.value)} />*/}
                    {/*</div>*/}
                    <div className="row top-margin">
                        <button className="publish-button" onClick={this.publishOrUpdate} disabled={!forLegal}>{this.state.update ? 'UPDATE' : 'PUBLISH'}</button>
                    </div>
                    {this.state.update ? (<div className="row">
                        <button className="delete-button" onClick={() => this.props.delete(this.state.event.id)} >DELETE</button>

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

