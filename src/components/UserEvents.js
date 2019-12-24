import React, { Component } from 'react';

class UserEvents extends Component {

    constructor() {
        super();
        this.imageIndex = 0;
        this.imagesCount = 5;
    }

    getImage=()=>{

        this.imageIndex++;

        if (this.imageIndex > this.imagesCount) {
            this.imageIndex = 1;
        }
        return `backgroundImage${this.imageIndex}.jpg`;
    }
    getUserEventsDiv=()=>{
        const events = this.props.events || [];

        // const events = [{
        //     id:'1',
        //     title:'poker night',
        //     description:'poker night',
        //     location:'somewhere',
        //     imageUrl:null,
        //     startDate: new Date(),
        //     endDate: new Date(),
        //     minParticipants: 3,
        //     maxParticipants: 30,
        //     additionalItems:[],
        //     participants: [{
        //         id: 1,
        //         imageUrl: 'https://lh3.googleusercontent.com/a-/AAuE7mAyuOJTvxfYVFwxKOd-h58A8Oxm1EVSf8OjpkSC3uk'
        //     }, {
        //         id: 2,
        //         imageUrl: 'https://lh3.googleusercontent.com/a-/AAuE7mA99CsCawUbTeZXQQuDTdQBr3NLRHiHKAwWdT3ifQ'
        //     }, {
        //         id: 3,
        //         imageUrl: 'https://lh4.googleusercontent.com/-rPs1rKb7XHg/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfnS_ka8BrQ8ZjuxF5fe1fG6P4cEg/photo.jpg'
        //     } ,{
        //         id: 4,
        //         imageUrl: 'https://lh5.googleusercontent.com/-1gIcswW4rwM/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reqOCMS5qJhFQJCA1rGgxaCp1LB4w/photo.jpg'
        //     }, {
        //         id: 5,
        //         imageUrl: 'https://lh4.googleusercontent.com/-rPs1rKb7XHg/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfnS_ka8BrQ8ZjuxF5fe1fG6P4cEg/photo.jpg'
        //     } ,{
        //         id: 6,
        //         imageUrl: 'https://lh4.googleusercontent.com/-rPs1rKb7XHg/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfnS_ka8BrQ8ZjuxF5fe1fG6P4cEg/photo.jpg'
        //     }]
        // }, {
        //     id:'2',
        //     title:'soccer!',
        //     description:'poker night',
        //     location:'somewhere',
        //     imageUrl:null,
        //     startDate: new Date(),
        //     endDate: new Date(),
        //     minParticipants: 3,
        //     maxParticipants: 30,
        //     additionalItems:[],
        //     participants: [{
        //         id: 1,
        //         imageUrl: 'https://lh6.googleusercontent.com/-ytRjEMsP4z4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3relWuDYAvQHC7SzvBmNhAdHzjGNTQ/photo.jpg'
        //     }, {
        //         id: 2,
        //         imageUrl: 'https://lh5.googleusercontent.com/-1gIcswW4rwM/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reqOCMS5qJhFQJCA1rGgxaCp1LB4w/photo.jpg'
        //     }, {
        //         id: 3,
        //         imageUrl: 'https://lh3.googleusercontent.com/-UT26zjWE2b4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdHThf6cKQFU8uEkvq-oLTj5diJYg/photo.jpg'
        //     }]
        // }];


        const eventsItems = events.map(event => {
            const participants = event.participants.slice(0,4).map((participant,index)=>{
                return <img alt='participant' className={`participantImage participantImage${index+1}`} src={participant.imageUrl} key={`event${event.id}_participant${participant.id}`}/>
            });
            const style = {
                backgroundImage: `url(${event.imageUrl || this.getImage()})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderRadiusTop: "5px",
                padding:"5px",
                width:   "40vw" ,
                height:  "25vw",

            };
            return (<div key={event.id} className="event-item-div"  onClick={()=>this.props.editEvent(event)}>
                <div key={event.id}  style={style}>
                    <b>{event.title }</b>
                </div>
                <div className="participantsImagesDiv">
                    {participants}
                </div>
            </div>);

        });


        return (<div id="user-events" >
            <div className="row">
                <div className="col-xs-6">
                    <div className="event-item-div plus-sign" onClick={this.props.createEvent}>
                        +
                    </div>
                </div>

                {eventsItems}

            </div>
        </div>)


    }



    render() {

        return this.getUserEventsDiv();
    }
}

export default UserEvents;


