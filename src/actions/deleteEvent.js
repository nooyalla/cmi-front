
import URL_PREFIX from '../url';

import request from 'request';

async function deleteEvent(eventId, provider, token){
    return new Promise((resolve,reject)=>{
        const options = {
            method:'DELETE',
            url: `${URL_PREFIX}/events/${eventId}`,
            headers:{
                provider: provider,
                "x-auth-token": token,
                "Content-Type":'application/json'
            }
        };
        request(options, (error, response, body) =>{
            if (error || response.statusCode>=400){
                if (error){
                    console.error('request cb error', error);
                    return reject('failed to delete event');
                }else{
                    const bodyObj = JSON.parse(body) ;
                    console.error('failed to delete event');
                    return reject(bodyObj.title);
                }
            } else{
                return resolve(eventId);
            }
        });
    })
};

export default deleteEvent;
