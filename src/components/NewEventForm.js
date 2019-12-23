import React, { Component } from 'react';

import DateTimePicker from 'react-datetime-picker';

class NewEventForm extends Component {

    constructor() {
        super();
        this.state = {
            selectedImage: null,
            error: null,
            page: 0,
            event: {
                title :'something',
                description:'',

                location:'somewhere',
                startDate: new Date(),
                endDate : null,
                lastConfirmationDate: null,

                imageUrl:null,

                minParticipants: 2,
                maxParticipants: 8,
                additionalItems: null,

            } };

        this.pages = [{ description: 'Setup Title & Description', getPage: this.getTitleAndDescriptionPage },
                      { description: 'Setup Location & Dates', getPage: this.getDatesAndLocationPage },
                      { description: 'Setup Event Background Image', getPage: this.getBackgroundImagePage },
                      { description: 'Setup optionals', getPage: this.getOptionalsPage },]
    }

    onPrev = () =>{
        const page = this.state.page - 1;
        this.setState({page});
    };
    onNext = () =>{
        const page = this.state.page + 1;
        this.setState({page});
    };

    handleTitleChange = (e) =>{
        const event = { ...this.state.event, title: e.target.value};
        this.setState({event});
    };

    handleDescriptionChange = (e) =>{
        const event = { ...this.state.event, description: e.target.value};
        this.setState({event});
    };

    handleLocationChange = (e) =>{
        const event = { ...this.state.event, location: e.target.value};
        this.setState({event});
    };

    handleStartDateChange = (startDate) =>{
        const event = { ...this.state.event, startDate};
        this.setState({event});
    };

    handleEndDateChange = (endDate) =>{
        const event = { ...this.state.event, endDate};
        this.setState({event});
    };
    handleLastConfirmationDateChange = (lastConfirmationDate) =>{
        const event = { ...this.state.event, lastConfirmationDate};
        this.setState({event});
    };

    getTitleAndDescriptionPage = ()=>{
        return (
            <div id="step-1" className="create-event-step">
                <div className="row">
                    <div className="formMainPageHeader">Step 1: { this.pages[this.state.page].description}:</div>
                </div>

                <div className="row">
                    <div className="col-sm-1">
                        <div className="formInputLabel"> Title<span className="red-text">*</span>:   </div>
                    </div>
                    <div className="col-sm-10">
                        <input type="text" id="newEventTitle" className="formTextInput" value={this.state.event.title} onChange={this.handleTitleChange}/>
                    </div>
                </div>


                <div className="formInputLabel">Description:   </div>


                <div className="row">
                    <div className="col-sm-11">
                        <textarea rows="3" id="newEventDescription"   className="formTextInput" value={this.state.event.description} onChange={this.handleDescriptionChange}/>
                    </div>
                </div>


                <div className="formMandetoryExplanation"><span className="red-text">* - required </span> </div>

                <button className="next-step-button" onClick={this.onNext} disabled={!this.state.event.title || this.state.event.title.length ===0} > Next </button>
            </div>
        )
    };
    getDatesAndLocationPage = ()=>{
        return (
            <div id="step-2" className="create-event-step">
                <div className="row">
                    <div className="formMainPageHeader">Step 2: { this.pages[this.state.page].description}:</div>
                </div>

                <div className="row">
                    <div className="col-sm-2">
                        <div className="formInputLabel"> Location<span className="red-text">*</span>:   </div>
                    </div>
                    <div className="col-sm-7">
                        <input type="text" id="newEventLocation"  className="formTextInput" value={this.state.event.location} onChange={this.handleLocationChange}/>

                    </div>
                </div>


                <div className="row">
                    <div className="col-sm-2">
                        <div className="formInputLabel"> Event Starts<span className="red-text">*</span>:   </div>
                    </div>
                    <div className="col-sm-7">
                        <DateTimePicker className="datePicker"
                            onChange={this.handleStartDateChange}
                            value={this.state.event.startDate}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-2">
                        <div className="formInputLabel">Event Ends:   </div>
                    </div>
                    <div className="col-sm-7">
                        <DateTimePicker className="datePicker"
                            onChange={this.handleEndDateChange}
                            value={this.state.event.endDate}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <div className="formInputLabel">Last conformation date<span className="red-text">*</span>:   </div>
                    </div>
                    <div className="col-sm-7">
                        <DateTimePicker className="datePicker"
                                        onChange={this.handleLastConfirmationDateChange}
                                        value={this.state.event.lastConfirmationDate}
                        />
                    </div>
                </div>

                <div className="formMandetoryExplanation"><span className="red-text">* - required </span> </div>
                <button className="prev-step-button" onClick={this.onPrev}> Prev </button>
                <button className="next-step-button" onClick={this.onNext} disabled={this.state.event.startDate === null || this.state.event.location === null || this.state.event.location.length === 0} > Next </button>
            </div>
        )
    };
    onImageClick = (selectedImage, imageUrl) => {
        console.log('onImageClick',selectedImage, imageUrl)
        const event = { ...this.state.event, imageUrl};
        this.setState({selectedImage, event });

    }
    getBackgroundImagePage = () => {

        const images = ['https://images.cdn2.stockunlimited.net/preview1300/music-event-background-concept_1934548.jpg',
                        'https://www.amara.com/static/uploads/images-1/products/x/huge/300362/luxe-towel-white-bath-sheet-135911.jpg',
                        'https://st4.depositphotos.com/3146979/20504/v/600/depositphotos_205041434-stock-video-abstract-animated-stained-background-seamless.jpg',
                        'https://media.gettyimages.com/photos/defocused-green-background-picture-id925561778?b=1&k=6&m=925561778&s=612x612&w=0&h=WZhW816nxLcLX5He41nozwc6ZbM1y0OOQhLoNYOGKME='];

        const imagesDivs= images.map((image,index)=>{
            return  <div className="col-sm-2">
                <img className={`eventImage ${this.state.selectedImage === (index+1) ? 'selectedEventImage': ''}`} src={image} onClick={()=>this.onImageClick(index+1,image)}/>
            </div>
        });
        return (
            <div id="step-3" className="create-event-step">
                <div className="row">
                    <div className="formMainPageHeader">Step 3: { this.pages[this.state.page].description}:</div>
                </div>

                 <div className="formInputLabel"> Choose Background Image:   </div>

                <div className="row">
                    {imagesDivs}
                </div>


                <div className="formMandetoryExplanation"><span className="red-text">* - required </span> </div>
                <button className="prev-step-button" onClick={this.onPrev}> Prev </button>
                <button className="next-step-button" onClick={this.onNext}> Next </button>
            </div>
        )
    };
    getOptionalsPage = () => {
        return (
            <div id="step-4" className="create-event-step">
                <div className="row">
                    <div className="formMainPageHeader">Step 3: { this.pages[this.state.page].description}:</div>
                </div>

                <div className="row">
                    <div className="col-sm-2">
                        <div className="formInputLabel"> Event Starts<span className="red-text">*</span>:   </div>
                    </div>
                    <div className="col-sm-7">
                        <DateTimePicker className="datePicker"
                                        onChange={this.handleStartDateChange}
                                        value={this.state.event.startDate}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-2">
                        <div className="formInputLabel">Event Ends:   </div>
                    </div>
                    <div className="col-sm-7">
                        <DateTimePicker className="datePicker"
                                        onChange={this.handleEndDateChange}
                                        value={this.state.event.endDate}
                        />
                    </div>
                </div>
                <div className="formMandetoryExplanation"><span className="red-text">* - required </span> </div>
                <button className="prev-step-button" onClick={this.onPrev}> Prev </button>
                <button className="next-step-button" onClick={this.onNext}> Next </button>
            </div>
        )
    };

    getProgress = () => {
        const stepsCount = this.pages.length;
        const currentStep = this.state.page;
        return <div className="progress">

        </div>
    }
    render() {

        const page = this.pages[this.state.page].getPage();
        const progress = this.getProgress();
        return (
            <div id="create-event-form container">
                <div >
                    <button id="cancel-new-event" className="button" onClick={this.props.onCancel}> Cancel </button>
                </div>
                <div>
                    {page}
                    {progress}
                </div>
            </div>
        );

    }
}

export default NewEventForm;

