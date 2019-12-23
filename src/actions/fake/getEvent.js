import events from './events';

const event = events[0];
async function getEvent(eventId, provider, token){
    return new Promise((resolve,reject)=>{
        return resolve({ event, provider, token });
    })
};

export default getEvent;
