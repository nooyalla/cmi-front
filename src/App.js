import React from 'react';
import SearchAppBar from './components/SearchAppBar';
import { Container } from '@material-ui/core';
import Events from './screens/Events';

const event1 = {
    id: "c1e0b38d-7cc2-4e43-aa4e-1e7d4133ab48",
    additionalItems: [],
    title: "Soccer",
    description: null,
    location: "somewhere",
    imageUrl: 'https://imcpokerdotco.files.wordpress.com/2014/07/ujkuj.jpg',
    startDate: "2019-11-26T07:47:12.796Z",
    endDate: null,
    lastConfirmationDate: "2019-10-26T05:47:12.796Z",
    minParticipants: 3,
    maxParticipants: 6,
    participantsHaveBeenNotify: false,
    createdAt: "2019-12-23T10:58:20.644Z",
    updatedAt: "2019-12-23T10:58:20.644Z",
    deletedAt: null,
    participants: [
        {
            id: "6a0c6532-53e6-4db0-a3a3-6de8dda70e8d",
            firstName: "noo",
            familyName: "yalla",
            email: "noo.yalla.2019@gmail.com",
            imageUrl: "https://lh6.googleusercontent.com/-mgEBJf3eguc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rehj_jBw-QZ-cLBHjP_Hul25FoHQA/photo.jpg",
            additionalItem: null
        }
    ]
}
const event2 = {
    ...event1,
    id: "c1e0b38d-7cc2-4e43-aa4e-1e7d4133ab44",
    additionalItems: [],
    title: "Poker",
}
const events = [event1,event2];

const App = () =>
    <div>
        <SearchAppBar />
        <Container maxWidth="sm" style={{ paddingTop: '16px' }}>
            <Events events={events} />
        </Container>
    </div>

export default App;