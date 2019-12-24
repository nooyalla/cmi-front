
import URL_PREFIX from '../url';

import request from 'request';

async function updateEvent(event, provider, token){
    return new Promise((resolve,reject)=>{
        const options = {
            method:'PATCH',
            url: `${URL_PREFIX}/events/${event.id}`,
            body:JSON.stringify(event),
            headers:{
                provider: provider,
                "x-auth-token": token,
                "Content-Type":'application/json'
            }
        };
        console.log('updateEvent',options.method, options.url, options.body);

        request(options, (error, response, body) =>{
            if (error || response.statusCode>=400){
                if (error){
                    console.error('request cb error', error);
                    return reject('failed to update event');
                }else{
                    const bodyObj = JSON.parse(body) ;
                    console.error('failed to update event');
                    return reject(bodyObj.title);
                }
            } else{
                return resolve(JSON.parse(body));
            }
        });
    })
};

export default updateEvent;
