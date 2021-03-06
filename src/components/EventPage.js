import React, { Component } from 'react';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AppsIcon from '@material-ui/icons/Apps';

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
        reminder -=  hours * HOUR;
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

        const { lastConfirmationDate, startDate, participants, minParticipants, additionalItems } = props.event;

        this.lastConfirmationDateOver = lastConfirmationDate < new Date();
        this.gameOn = participants.length >= minParticipants;
        const { days, hours, minutes, seconds } = this.getDateParts(!this.lastConfirmationDateOver ?   lastConfirmationDate: startDate);
        this.backgroundImage = `url(${props.event.imageUrl ||  `backgroundImage1.jpg`})`;
        let selectedItem=null;
        if (additionalItems.length>0) {
            const allItems = additionalItems.split('|');
            participants.forEach(({additionalItem}) => {
                const index = allItems.findIndex((item => item === additionalItem));
                if (index >= 0) {
                    allItems.splice(index, 1);
                }
            });

            if (allItems.length > 0) {
                this.allItems = allItems;
                selectedItem = allItems[0];
            }
        }

        this.state = {
            days, hours, minutes, seconds, selectedItem
        };
        setInterval(()=>{
            const { days, hours, minutes, seconds } = this.getDateParts(!this.lastConfirmationDateOver ?   lastConfirmationDate: startDate);
            this.setState({days, hours, minutes, seconds})
        },1000)
    }



    attendOrUnattend = (attending, eventId)=>{
        if (attending){
            return this.props.unattend(eventId)
        }else{
            return this.props.attend(eventId, this.state.selectedItem)
        }
    }
    onItemSelected = ({value: selectedItem})=>{
        this.setState({selectedItem })
    }
    getHeader = ()=>{
        const { event, user } = this.props;
        const isCreator = event.creatorId === user.id;
        return  <div id="app-header">
            <span id="app-header-text">ImIN</span>
            {
                isCreator ? <span id="event-page-edit-link" onClick={()=>this.props.edit(event)}>edit</span> : <span/>
            }

        </div>
    }

    render() {
        const { event, user } = this.props;
        const header = this.getHeader();

        const attending = event.participants.some(participant => participant.id === user.id);

        const eventDay = days[event.startDate.getDay()];

        const eventDate = `${event.startDate.getDate()}/${event.startDate.getMonth() +1}/${event.startDate.getFullYear()}`;

        const style = {
            background: "black",
            backgroundColor: "black",
            backgroundImage: this.backgroundImage,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            padding: "5px",
            width:   "100vw" ,
            height:  "52vh",

        };

        const creator = event.participants.find(participant => participant.id === event.creatorId);
        const creatorImage = creator ? creator.imageUrl : null;
        const totalParticipants = event.participants.length;
        const participants = event.participants.slice(0,4).map((participant,index)=>{
            return <img alt="" className={`event-participantImage event-participantImage${index+1}`} src={participant.imageUrl} key={`event${event.id}_participant${participant.id}`}/>
        });
        if (participants.length < totalParticipants){
            const more = totalParticipants - participants.length;
            participants.push(<div className="more-participants-circle"> +{more}</div>)
        }
        const maxParticipants = event.maxParticipants;
        const allParticipants = event.participants.map((participant,index)=>{
            return (<div className="event-page-all-participant-item row" key={`event${event.id}_all_participant${participant.id}`}>
                {index === maxParticipants && (
                    <div className="col-xs-12 line" >
                        <u>standby</u>
                    </div>
                )}
                <div className="col-xs-4" >
                    <img alt="" className="event-page-all-participant-item-image" src={participant.imageUrl} />
                </div>
                <div className="col-xs-7 event-page-all-participant-item-name" >
                    {participant.firstName} {participant.familyName} <span className="participant-additional-item" >{participant.additionalItem && participant.additionalItem.length>0 ? ` (${participant.additionalItem})`:''}</span>
                </div>

            </div>)
        });

        const showDropbox =  this.allItems && !attending;

        const dropdown = !showDropbox ? <span/> : (
                <select id="Dropdown" value={this.state.selectedItem}
                        onChange={(e) => this.setState({selectedItem: e.target.value})}>

                    {this.allItems.map((item,index)=>{
                        return  <option key={`${item}_${index}`} value={item}>{item}</option>
                    })}
                </select>
            )



        return (
            <div id="container">
                {header}
                <div id="event-image-title-and-timer" style={style}>
                    <div className="row">
                        <div className="col-xs-8 event-page-title">
                            <div>{event.title}</div>
                            <div  className="event-page-description">{event.description}</div>

                        </div>
                        <div className="col-xs-1">

                        </div>
                        <div className="col-xs-3">
                            { creatorImage &&  <img alt="" className="event-image-creator-image" src={creatorImage}/> }
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
                       <DateRangeIcon/> {eventDay}, {eventDate}
                    </div>
                    <div id="event-location-text">
                       <LocationOnIcon/> {event.location}
                    </div>
                    { showDropbox &&
                        <div id="event-dropdown-div">
                            <AppsIcon/> select one: {dropdown}
                        </div>
                    }

                    { !this.lastConfirmationDateOver ? (<button className="approve-button" onClick={()=>this.attendOrUnattend(attending, event.id)} >{attending ? "I'M OUT": "I'M IN"}</button>) : (
                        <div id="is-game-on-text"  className={this.gameOn ?'game-on':'game-canceled'}>{this.gameOn ? "IT IS ON!" : "NOPE, CANCELED.."} </div>
                    )}

                    <div id="event-all-participants">
                        <u>participants:</u><br/>
                        {allParticipants}
                    </div>


                </div>
            </div>
        );

    }
}

export default EventPage;

