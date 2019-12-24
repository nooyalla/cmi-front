
import React, { Component } from 'react';
import createEvent from './actions/createEvent';

import Login from './components/Login';
import NewEventForm from './components/NewEventForm';

import Loading from './containers/Loading';
import UserEvents from "./components/UserEvents";

Date.prototype.addHours = function(h) {
    const newDate = new Date(this);
    newDate.setTime(this.getTime() + (h*60*60*1000));
    return newDate;
}

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

        this.state = { showCreationForm: false, showEventEditForm:null, loading: false, isAuthenticated: false, user: null, events:null, provider:'', error:null, token:null};

    }

    logout = () => {
        localStorage.removeItem('authData');
        this.setState({isAuthenticated: false, user: null, events:[], error:null})

    };

    createEvent = () => {
        this.setState({ showCreationForm: true, error:null})
    };

    editEventForm = (event) => {
        this.setState({ showEventEditForm: event})
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

    onLogin = ({userContext, provider, token, events}) => {
        this.setState({user: userContext, events, loading: false, isAuthenticated: true, error:null, provider, token})
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
                const events = [newEvent, ...this.state.events];
                this.setState({ loading: false, events});

            } catch (error) {
                this.setState({ loading: false, error});
            }
        },0)

    };

    render() {
        const {loading, isAuthenticated, events, showCreationForm, showEventEditForm}  = this.state;
        console.log('main render loading:',loading,'isAuthenticated', isAuthenticated, 'events', events);
        if (loading){
            return  <Loading/>;
        }
        if (!isAuthenticated){
            return  <Login onLogin={this.onLogin} />;
        }

        if (showEventEditForm){
            console.log('showEventEditForm',showEventEditForm)
            //TODO
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

                    <UserEvents createEvent={this.createEvent} events={this.state.events}/>

                </div>

            </div>);

    }
}

export default App;

