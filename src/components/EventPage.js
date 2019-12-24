import React, { Component } from 'react';

class EventPage extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    getImage=()=>{

        this.imageIndex++;

        if (this.imageIndex > this.imagesCount) {
            this.imageIndex = 1;
        }
        return `backgroundImage${this.imageIndex}.jpg`;
    }

    getHeader = ()=>{
        return  <div id="app-header">
            <span id="app-header-text">IMIN</span>   <span id="app-header-logout" onClick={this.logout}>logout</span>
        </div>
    }

    render() {
        const header = this.getHeader();
        const { event } = this.props;
        const style = {
            backgroundImage: `url(${event.imageUrl || this.getImage()})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            padding: "5px",
            width:   "100vw" ,
            height:  "45vh",

        };
        return (
            <div id="container">
                {header}
                <div id="event-image-title-and-timer" style={style}>
                    <h1>event.title</h1>

                </div>


            </div>
        );

    }
}

export default EventPage;

