
import URL_PREFIX from '../url';

import request from 'request';

async function attendEvent(eventId, selectedItem, provider, token){
    return new Promise((resolve,reject)=>{
        const options = {
            method:'POST',
            url: `${URL_PREFIX}/events/${eventId}/attend`,
            body:JSON.stringify({
                additionalItem: selectedItem
            }),
            headers:{
                provider: provider,
                "x-auth-token": token,
                "Content-Type":'application/json'
            }
        };
        console.log('attendEvent',options.method, options.url, options.body);
        request(options, (error, response, body) =>{
            if (error || response.statusCode>=400){
                if (error){
                    console.error('request cb error', error);
                    return reject('failed to attend event');
                }else{
                    const bodyObj = JSON.parse(body) ;
                    console.error('failed to attend event');
                    return reject(bodyObj.title);
                }
            } else{
                return resolve(JSON.parse(body));
            }
        });
    })
};

export default attendEvent;
