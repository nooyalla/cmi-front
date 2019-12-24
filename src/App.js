
import React, { Component } from 'react';
import createEvent from './actions/createEvent';
import updateEvent from './actions/updateEvent';
import deleteEvent from './actions/deleteEvent';
import getEvent from './actions/getEvent';

//import Login from './components/Login';
import NewEventForm from './components/NewEventForm';
import EventPage from './components/EventPage';

import Loading from './containers/Loading';
import UserEvents from "./components/UserEvents";

String.prototype.datePickerToDate = function() {
    const stringValue =  this;//2017-11-23
    const day = stringValue.substr(8,2);
    const month = stringValue.substr(5,2);
    const year = stringValue.substr(0,4);
    return new Date(year, month-1, day, 12, 0, 0);
};

Date.prototype.AsDatePicker = function() {
    return this.toISOString().substr(0,10);
};

class App extends Component {

    constructor() {
        super();
        this.state = { showCreationForm: false, showEventEditForm:null, loading: false, isAuthenticated: false, user: null, events:null, provider:'', error:null, token:null, showEventPage: null};
    }

    logout = () => {
        localStorage.removeItem('authData');
        this.setState({isAuthenticated: false, user: null, events:[], error:null})
        window.location.replace('https://im-in.herokuapp.com');

    };

    createEvent = () => {
        this.setState({ showCreationForm: true, error:null})
    };



    onCancel = () => {
        this.setState({ showCreationForm: false, error:null, showEventEditForm:null})
    };

    onFailure = (error) => {
        console.error('App onFailure', error);
        this.setState({error })
    };

    backToMainPage = () => {
        this.setState({group:null, players:null,games:null,error:null});
    };

    onLogin = async ({userContext, provider, token, events}) => {
        const url = new URL(window.location.href);
        const eventId = url.searchParams.get("eventId");
        if (eventId){
            this.setState({user: userContext, events, loading: true, isAuthenticated: true, error:null, provider, token})

            setTimeout(async ()=>{
                const event = await getEvent(eventId,  provider, token);
                this.setState({loading: false, showEventPage: event});
            },0)
        } else{
            this.setState({user: userContext, events, loading: false, isAuthenticated: true, error:null, provider, token})

        }

    };

    getHeader = ()=>{
        return  <div id="app-header">
            <span id="app-header-text">IMIN</span>   <span id="app-header-logout" onClick={this.logout}>logout</span>
        </div>
    }

    publish = (event)=>{
        console.log('app publish, event:', event)
        this.setState({ showCreationForm: false, error:null, showEventEditForm:null, loading: true});
        setTimeout(async ()=>{
            try {
                const newEvent = await createEvent(event, this.state.provider, this.state.token);
                const events = [newEvent, ...this.state.events];
                this.setState({ loading: false, events, showEventPage: newEvent});

            } catch (error) {
                this.setState({ loading: false, error});
            }
        },0)

    };

    update = (event)=>{
        console.log('app update, event:', event)
        this.setState({ showCreationForm: false, error:null, showEventEditForm:null, loading: true});
        setTimeout(async ()=>{
            try {
                const updatedEvent = await updateEvent(event, this.state.provider, this.state.token);
                const events = this.state.events.map(event=>{
                    if (event.id === updatedEvent.id){
                        return updatedEvent;
                    } else{
                        return event;
                    }
                });
                this.setState({ loading: false, events});

            } catch (error) {
                this.setState({ loading: false, error});
            }
        },0)

    };
    delete = (eventId)=>{
        console.log('app delete, event:', eventId)
        this.setState({ showCreationForm: false, error:null, showEventEditForm:null, loading: true});
        setTimeout(async ()=>{
            try {
                console.log('before calling delete')
                const deletedEventId = await deleteEvent(eventId, this.state.provider, this.state.token);
                console.log('after calling delete')
                const events = this.state.events.filter(event=>(event.id !== deletedEventId));
                this.setState({ loading: false, events});

            } catch (error) {
                console.log('error calling delete',error)
                this.setState({ loading: false, error});
            }
        },0)

    };

    editEvent = (event) =>{
        this.setState({ showEventEditForm: event})
    }

    render() {
        const {loading, isAuthenticated, events, showCreationForm, showEventEditForm, showEventPage}  = this.state;
        console.log('main render loading:',loading,'isAuthenticated', isAuthenticated, 'events', events);
        if (loading){
            return  <Loading/>;
        }
        if (!isAuthenticated){
            return  <Login onLogin={this.onLogin} />;
        }

        if (showEventPage){
            return <EventPage goHome={this.logout} event={showEventPage}/>
        }
        if (showEventEditForm){
            return  <NewEventForm onCancel={this.onCancel} update={this.update} delete={this.delete} event={showEventEditForm} />;
        }
        if (showCreationForm){
            return  <NewEventForm onCancel={this.onCancel} publish={this.publish} />;
        }

        const header = this.getHeader();
        return (
            <div className="App container">
                <div className="errorSection">
                    {this.state.error}
                </div>
                {header}
                <div className="MainSection">

                    <UserEvents createEvent={this.createEvent} events={this.state.events} editEvent={this.editEvent}/>

                </div>

            </div>);

    }
}

export default App;

