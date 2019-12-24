import React, { Component } from 'react';
const SECOND = 1000;
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class EventPage extends Component {

    getDateParts(date){

        const now = new Date();
        const bigger = now < date ? date : now;
        const smaller = now < date ? now : date;
        const totalSeconds =  Math.floor((bigger.getTime() - smaller.getTime()) / SECOND);
        const days = Math.floor(totalSeconds / DAY);
        let reminder = totalSeconds - days * DAY;
        const hours = Math.floor(reminder / HOUR);
        reminder = reminder - hours * HOUR;
        const minutes =  Math.floor(reminder / MINUTE);
        const seconds = reminder - minutes * MINUTE;
        return {
            days: days>9 ? `${days}` : `0${days}`,
            hours:hours>9 ? `${hours}` : `0${hours}`,
            minutes:minutes>9 ? `${minutes}` : `0${minutes}`,
            seconds:seconds>9 ? `${seconds}` : `0${seconds}`,
        }
    }

    constructor(props) {
        super(props);

        const { lastConfirmationDate } = props.event;
        const { days, hours, minutes, seconds } = this.getDateParts(lastConfirmationDate);
        this.backgroundImage = `url(${props.event.imageUrl ||  `backgroundImage1.jpg`})`;
        this.state = {
            days, hours, minutes, seconds
        };
        setInterval(()=>{
            const { days, hours, minutes, seconds } = this.getDateParts(lastConfirmationDate);
            this.setState({days, hours, minutes, seconds})
        },1000)
    }



    attendOrUnattend = (attending, eventId)=>{
        if (attending){
            return this.props.unattend(eventId)
        }else{
            return this.props.attend(eventId)
        }
    }
    getHeader = ()=>{
        return  <div id="app-header">
            <span id="app-header-text">IMIN</span>
        </div>
    }

    render() {
        const header = this.getHeader();
        const { event, user } = this.props;
        console.log(' event.participants', event.participants);
        console.log(' user', user);
        const attending =  event.participants.some(participant => participant.id === user.id);

        const eventDay = days[event.startDate.getDay()];


        const eventDate = `${event.startDate.getDate()}/${event.startDate.getMonth() +1}/${event.startDate.getFullYear()}`;

        const style = {
            backgroundImage: this.backgroundImage,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            padding: "5px",
            width:   "100vw" ,
            height:  "55vh",

        };
        const creatorImage = event.participants[0].imageUrl;
        const totalParticipants = event.participants.length;
        const participants = event.participants.slice(0,4).map((participant,index)=>{
            return <img className={`event-participantImage event-participantImage${index+1}`} src={participant.imageUrl} key={`event${event.id}_participant${participant.id}`}/>
        });
        if (participants.length < totalParticipants){
            const more = totalParticipants - participants.length;
            participants.push(<div className="more-participants-circle"> +{more}</div>)
        }

        return (
            <div id="container">
                {header}
                <div id="event-image-title-and-timer" style={style}>
                    <div className="row">
                        <div className="col-xs-8 event-page-title">
                            {event.title}
                        </div>
                        <div className="col-xs-1">

                        </div>
                        <div className="col-xs-3">
                            <img className="event-image-creator-image" src={creatorImage}/>
                        </div>
                    </div>
                    <div className="row timer-div">

                        <div className="col-xs-2 event-timer-item">

                            <span className="event-timer-number">{this.state.days}</span> <br/>
                            <span className="event-timer-title">days</span>
                        </div>
                        <div className="col-xs-2 event-timer-item">
                            <span className="event-timer-number">{this.state.hours}</span> <br/>
                            <span className="event-timer-title">hours</span>
                        </div>
                        <div className="col-xs-2 event-timer-item">
                            <span className="event-timer-number">{this.state.minutes}</span> <br/>
                            <span className="event-timer-title">minutes</span>
                        </div>
                        <div className="col-xs-2 event-timer-item">
                            <span className="event-timer-number">{this.state.seconds}</span> <br/>
                            <span className="event-timer-title">seconds</span>
                        </div>
                        <div id="event-participants">
                            {participants}
                        </div>
                    </div>


                </div>

                <div id="event-details-div">
                    <div id="event-date-text">
                        {eventDay}, {eventDate}
                    </div>
                    <div id="event-location-text">
                        {event.location}
                    </div>


                    <button className="approve-button" onClick={()=>this.attendOrUnattend(attending, event.id)} >{attending ? "I'M OUT": "I'M IN"}</button>


                </div>
            </div>
        );

    }
}

export default EventPage;

