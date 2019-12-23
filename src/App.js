
import React, { Component } from 'react';

import Login from './components/Login';
import NewEventForm from './components/NewEventForm';

import Loading from './containers/Loading';

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
        console.log('App constructor');
       // const notFirst = localStorage.getItem('notFirst');
       // const loading = !notFirst;
        this.state = { showCreationForm: true, loading: false, isAuthenticated: false, user: null, events:[], provider:'', error:null, token:null};
        // if (!notFirst){
        //     localStorage.setItem('notFirst', 'true');
        //     setTimeout(()=>{
        //         this.setState({loading: false});
        //     },2700)
        // }
    }

    logout = () => {
        localStorage.removeItem('authData');
        this.setState({isAuthenticated: false, user: null, events:[], error:null})

    };

    createEvent = () => {
        this.setState({ showCreationForm: true, error:null})
    };

    onCancel = () => {
        this.setState({ showCreationForm: false, error:null})
    };

    onFailure = (error) => {
        console.error('App onFailure', error);
        this.setState({error })
    };

    backToMainPage = () => {
        this.setState({group:null, players:null,games:null,error:null});
    };

    onLogin = ({userContext, provider, token, events}) => {
        this.setState({user: userContext, events, loading: false, isAuthenticated: true, error:null, provider, token})
    };

    render() {
        const {loading, isAuthenticated, events, showCreationForm}  = this.state;
        console.log('main render loading:',loading,'isAuthenticated', isAuthenticated, 'events', events);
        if (loading){
            return  <Loading/>;
        }
        if (!isAuthenticated){
            return  <Login onLogin={this.onLogin} />;
        }

        if (showCreationForm){
            return  <NewEventForm onCancel={this.onCancel} />;
        }

        const eventsDiv = events.length === 0 ? <div className="events-header"> No events yet </div> : (
            <div >
                <div className="events-header"><b><u>{events.length} Event{events.length >1 ? 's':''}:</u></b>  </div>
                {events.map(event=>{

                    const style = {
                        backgroundImage: `url(${event.image})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        width: "100%",
                        height: "100%"
                    };
                    return <div key={event.id} className="event-item" style={style}>
                        <h1><b><u>{event.title}</u></b></h1>
                        <h2>{event.description}</h2>
                        <h3> {event.paricipents.length} confirmed paricipent{event.paricipents.length === 1 ? '' :'s'}</h3>

                    </div>
                })}
            </div>

        );

        return (
            <div className="App">
                <div className="errorSection">
                    {this.state.error}
                </div>
                <div className="MainSection">
                    <div >
                        <button className="button logout" onClick={this.logout}> Log out </button>
                    </div>
                    <div>
                        <button className="button create-event" onClick={this.createEvent}> Create New Event </button>
                        {eventsDiv}
                    </div>

                </div>

            </div>);

    }
}

export default App;

