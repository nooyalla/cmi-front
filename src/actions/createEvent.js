
import URL_PREFIX from '../url';

import request from 'request';

async function createEvent(event, provider, token){
    return new Promise((resolve,reject)=>{
        const options = {
            method:'POST',
            url: `${URL_PREFIX}/events`,
            body:JSON.stringify(event),
            headers:{
                provider: provider,
                "x-auth-token": token,
                "Content-Type":'application/json'
            }
        };
        console.log('createEvent',options.method, options.url, options.body);
        request(options, (error, response, body) =>{
            if (error || response.statusCode>=400){
                if (error){
                    console.error('request cb error', error);
                    return reject('failed to create new event');
                }else{
                    const bodyObj = JSON.parse(body) ;
                    console.error('failed to create new event');
                    return reject(bodyObj.title);
                }
            } else{
                return resolve(JSON.parse(body));
            }
        });
    })
};

export default createEvent;
