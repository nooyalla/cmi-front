import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';

function addHours(date, h) {
    const newDate = new Date(date);
    newDate.setTime(newDate.getTime() + (h*60*60*1000));
    return newDate;
}

class NewEventForm extends Component {

    constructor(props) {
        super(props);
        const event = props.event || {
            title :'',
            description:'',
            location:'',
            startDate: new Date(),
            endDate : null,
            lastConfirmationDate: null,
            imageUrl:null,
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

    handleEventItemChange = (attributeName, newValue) =>{
        const event = { ...this.state.event, [attributeName]: newValue};
        this.setState({event});
    };
    handleStartDateChange = (startDate) =>{
        const event = { ...this.state.event, startDate};
        this.setState({event});
    };

    getHeader = ()=>{
        return  <div id="app-header">
            <span id="app-header-text">IMIN</span>
        </div>
    }

    publishOrUpdate = ()=>{

        const endDate = addHours(this.state.event.startDate,this.state.duration);
        const lastConfirmationDate = addHours((new Date()),this.state.timer);

        const event = {
            title :this.state.event.title,
            description: '',
            location:this.state.event.location,
            startDate: this.state.event.startDate,
            endDate,
            lastConfirmationDate,
            imageUrl:null,
            minParticipants: this.state.event.minParticipants,
            maxParticipants:this.state.event.maxParticipants,
            additionalItems: null
        };

        if (this.state.update){
            event.id = this.state.event.id;
            console.log('form update, event:', event);
            this.props.update(event);
        }else{
            console.log('form publish, event:', event);
            this.props.publish(event);
        }

    }


    render() {
        const header = this.getHeader();

        const forLegal = this.state.event.title.length >0 && this.state.event.location.length >0 && this.state.event.startDate && this.state.event.minParticipants <= this.state.event.maxParticipants;

        return (
            <div id="create-event-form container">
                {header}
                <div id="create-event-form-wrapper">
                    <div className="row">
                        <span className="new-event-form-item-label">Title</span>
                    </div>
                    <div className="row">
                        <input type="text" placeholder="Enter event name" id="newEventTitle" className="formTextInput-full-width" value={this.state.event.title} onChange={(e)=>this.handleEventItemChange('title', e.target.value)}/>
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
                            <input type="number" min="1" max="1000"  className="formNumberInput-half-width" value={this.state.event.minParticipants} onChange={(e)=>this.handleEventItemChange('minParticipants', e.target.value)}/>
                        </div>
                        <div className="col-xs-1">
                            <span className="white">_______</span>
                        </div>
                        <div className="col-xs-5">
                            <input type="number" min={this.state.event.minParticipants} max="1000"   className="formNumberInput-half-width" value={this.state.event.maxParticipants} onChange={(e)=>this.handleEventItemChange('maxParticipants', e.target.value)}/>
                        </div>
                    </div>
                    <div className="row">
                        <span className="new-event-form-item-label">Location</span>
                    </div>
                    <div className="row">
                        <input type="text" placeholder="Enter event location" id="newEventTitle" className="formTextInput-full-width locationInput" value={this.state.event.location} onChange={(e)=>this.handleEventItemChange('location', e.target.value)}/>
                    </div>
                    <div className="row">
                        <div className="col-xs-3">
                            <span className="new-event-form-item-label">Date</span>
                        </div>
                        <div className="col-xs-1">
                            <span className="white">________</span>
                        </div>
                        <div className="col-xs-3">
                            <span className="new-event-form-item-label">Time</span>
                        </div>
                        <div className="col-xs-1">
                            <span className="white">___________</span>
                        </div>
                        <div className="col-xs-3">
                            <span className="new-event-form-item-label">Duration</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-7">
                            <DateTimePicker className="datePicker"
                                            onChange={this.handleStartDateChange}
                                            value={this.state.event.startDate}
                            />
                        </div>

                        <div className="col-xs-1">
                            <span className="white">__</span>
                        </div>
                        <div className="col-xs-3">
                            <input type="number" min="1" max="100"   className="formNumberInput-small-width" value={this.state.duration} onChange={(e)=>this.setState({duration: e.target.value})}/>
                            <br/><span className="hours-text">hours</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-11">
                            <span className="new-event-form-item-label">Timer</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-11">
                            <input type="number" min="1" max="48"   className="formNumberInput-small-width" value={this.state.timer} onChange={(e)=>this.setState({timer: e.target.value})}/>
                            <br/><span className="hours-text">hours</span>
                        </div>
                    </div>
                    <div className="row top-margin">
                        <button className="publish-button" onClick={this.publishOrUpdate} disabled={!forLegal}>{this.state.update ? 'UPDATE' :'PUBLISH'}</button>
                    </div>
                    {this.state.update ? (  <div className="row">
                        <button className="delete-button" onClick={()=>this.props.delete(this.state.event.id)} disabled={!forLegal}>DELETE</button>
                    </div>) : <div/>}

                </div>
            </div>
        );

    }
}

export default NewEventForm;

