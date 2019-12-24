
import React, { Component } from 'react';
import createEvent from './actions/createEvent';
import updateEvent from './actions/updateEvent';
import deleteEvent from './actions/deleteEvent';
import getEvent from './actions/getEvent';
import attendEvent from './actions/attendEvent';
import unattendEvent from './actions/unattendEvent';

import Login from './components/Login';
import NewEventForm from './components/NewEventForm';
import EventPage from './components/EventPage';

import Loading from './containers/Loading';
import UserEvents from "./components/UserEvents";


function setupEventDates(event){
    event.startDate = new Date(event.startDate);
    event.endDate = new Date(event.endDate);
    event.lastConfirmationDate = new Date(event.lastConfirmationDate);
    return event;
}
class App extends Component {

    constructor() {
        super();
        // const event = {
        //         id:'1',
        //         title:'poker night  ssdf sd',
        //         description:'poker night ',
        //         location:'somewhere',
        //         imageUrl:null,
        //         startDate: new Date(),
        //         endDate: new Date(),
        //         lastConfirmationDate: new Date(2019,11,23,18,0,23),
        //         minParticipants: 2,
        //         maxParticipants: 30,
        //         additionalItems:[],
        //         participants: [{
        //             id: 1,
        //             imageUrl: 'https://lh3.googleusercontent.com/a-/AAuE7mAyuOJTvxfYVFwxKOd-h58A8Oxm1EVSf8OjpkSC3uk'
        //         }, {
        //             id: 2,
        //             imageUrl: 'https://lh3.googleusercontent.com/a-/AAuE7mA99CsCawUbTeZXQQuDTdQBr3NLRHiHKAwWdT3ifQ'
        //         }, {
        //             id: 3,
        //             imageUrl: 'https://lh4.googleusercontent.com/-rPs1rKb7XHg/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfnS_ka8BrQ8ZjuxF5fe1fG6P4cEg/photo.jpg'
        //         } ,{
        //             id: 4,
        //             imageUrl: 'https://lh5.googleusercontent.com/-1gIcswW4rwM/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reqOCMS5qJhFQJCA1rGgxaCp1LB4w/photo.jpg'
        //         }, {
        //             id: 5,
        //             imageUrl: 'https://lh4.googleusercontent.com/-rPs1rKb7XHg/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfnS_ka8BrQ8ZjuxF5fe1fG6P4cEg/photo.jpg'
        //         } ,{
        //             id: 6,
        //             imageUrl: 'https://lh4.googleusercontent.com/-rPs1rKb7XHg/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfnS_ka8BrQ8ZjuxF5fe1fG6P4cEg/photo.jpg'
        //         },{
        //             id: 6,
        //             imageUrl: 'https://lh4.googleusercontent.com/-rPs1rKb7XHg/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfnS_ka8BrQ8ZjuxF5fe1fG6P4cEg/photo.jpg'
        //         },{
        //             id: 6,
        //             imageUrl: 'https://lh4.googleusercontent.com/-rPs1rKb7XHg/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfnS_ka8BrQ8ZjuxF5fe1fG6P4cEg/photo.jpg'
        //         }]
        //     }

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
                setupEventDates(event)
                this.setState({loading: false, showEventPage: event});
            },0)
        } else{
            this.setState({user: userContext, events, loading: false, isAuthenticated: true, error:null, provider, token})

        }

    };

    getHeader = ()=>{
        return  <div id="app-header">
            <span id="app-header-text">IMIN</span>
        </div>
    }

    publish = (event)=>{
        console.log('app publish, event:', event)
        this.setState({ showCreationForm: false, error:null, showEventEditForm:null, loading: true});
        setTimeout(async ()=>{
            try {
                const newEvent = await createEvent(event, this.state.provider, this.state.token);
                setupEventDates(newEvent);
                const events = [newEvent, ...this.state.events];
                this.setState({ loading: false, events, showEventPage: newEvent});
                window.location.replace(`https://im-in.herokuapp.com?eventId=${newEvent.id}`);
                window.location.href = `https://im-in.herokuapp.com?eventId=${newEvent.id}`;

            } catch (error) {
                this.setState({ loading: false, error});
            }
        },0)

    };

    attend = (eventId)=>{
        console.log('app attend, event:', eventId);
        this.setState({ error:null, loading: true});
        setTimeout(async ()=>{
            try {
                const updatedEvent = await attendEvent(eventId, this.state.provider, this.state.token);
                setupEventDates(updatedEvent);
                const events = this.state.events.map(event=>{
                    if (event.id === updatedEvent.id){
                        return updatedEvent;
                    } else{
                        return event;
                    }
                });
                this.setState({ loading: false, events, showEventPage: updatedEvent});

            } catch (error) {
                this.setState({ loading: false, error});
            }
        },0)
    };
    unattend = (eventId)=>{
        console.log('app unattend, event:', eventId);
        this.setState({ error:null, loading: true});
        setTimeout(async ()=>{
            try {
                const updatedEvent = await unattendEvent(eventId, this.state.provider, this.state.token);
                setupEventDates(updatedEvent);
                const events = this.state.events.map(event=>{
                    if (event.id === updatedEvent.id){
                        return updatedEvent;
                    } else{
                        return event;
                    }
                });
                this.setState({ loading: false, events, showEventPage: updatedEvent});

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
                setupEventDates(updatedEvent);
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
        // if (!isAuthenticated){
        //     return  <Login onLogin={this.onLogin} />;
        // }

        if (showEventPage){
            return <EventPage goHome={this.logout} event={showEventPage} user={this.state.user || {}} unattend={this.unattend} attend={this.attend}/>
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

