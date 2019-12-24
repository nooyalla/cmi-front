
import URL_PREFIX from '../url';

import request from 'request';

async function unattendEvent(eventId, provider, token){
    return new Promise((resolve,reject)=>{
        const options = {
            method:'POST',
            url: `${URL_PREFIX}/events/${eventId}/unattend`,
            body:JSON.stringify({}),
            headers:{
                provider: provider,
                "x-auth-token": token,
                "Content-Type":'application/json'
            }
        };
        console.log('unattendEvent',options)
        request(options, (error, response, body) =>{
            if (error || response.statusCode>=400){
                if (error){
                    console.error('request cb error', error);
                    return reject('failed to unattend event');
                }else{
                    const bodyObj = JSON.parse(body) ;
                    console.error('failed to unattend event');
                    return reject(bodyObj.title);
                }
            } else{
                return resolve(JSON.parse(body));
            }
        });
    })
};

export default unattendEvent;
