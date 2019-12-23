async function updateEvent(eventId, event, provider, token){
    return new Promise((resolve,reject)=>{
        return resolve({ status: 'ok', provider, token });
    })
};

export default updateEvent;
