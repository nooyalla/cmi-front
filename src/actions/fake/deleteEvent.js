async function deleteEvent(eventId, event, provider, token){
    return new Promise((resolve,reject)=>{
        return resolve({ status: 'ok', provider, token });
    })
};

export default deleteEvent;
