import React, { Component } from 'react';

import Login from './components/Login';
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

Date.prototype.AsGameName = function() {
    const stringValue = this.toISOString().substr(0,10);
    const day = stringValue.substr(8,2);
    const month = stringValue.substr(5,2);
    const year = stringValue.substr(0,4);
    return `${day}/${month}/${year}`;
};

const keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    document.addEventListener('wheel', preventDefault, {passive: false}); // Disable scrolling in Chrome
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    document.removeEventListener('wheel', preventDefault, {passive: false}); // Enable scrolling in Chrome
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
}

function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

class App extends Component {

    constructor() {
        super();
        const notFirst = localStorage.getItem('notFirst');
        const loading = !notFirst;
        this.state = { loading, isAuthenticated: false, user: null, events:[], provider:'', error:null, token:null};
        if (!notFirst){
            localStorage.setItem('notFirst', true);
            setTimeout(()=>{
                this.setState({loading: false});
            },2700)
        }
    }

    logout = () => {
        localStorage.removeItem('authData');
        this.setState({isAuthenticated: false, user: null, events:[], error:null})
        try {
            sessionStorage.clear();
            localStorage.clear();
            deleteAllCookies();
        } catch (e) {
            console.log('ERROR',e)
        }
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
        const {loading, isAuthenticated, events}  = this.state;
        if (loading){
            return  <Loading/>;
        }
        if (!isAuthenticated){
            return  <Login onLogin={this.onLogin} />;
        }

        const eventsDiv = events.length === 0 ? <div className="events-header"> No events yet </div> : (
            <div >
                <div className="events-header"><b><u>{events.length} Event{events.length >1 ? 's':''}:</u></b>  </div>
                {events.map(event=>{

                    const style = {
                        "background-image": `url(${event.image})`,
                        "background-repeat": "no-repeat",
                        "background-size": "cover",
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

