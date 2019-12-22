
import URL_PREFIX from '../url';
import request from 'request';

async function login(provider, token){
    return new Promise((resolve,reject)=>{

        const options = {
            url: `${URL_PREFIX}/events/`,
            headers:{
                provider,
                "x-auth-token": token,
                "Content-Type":'application/json'
            }
        };

        request(options, (error, response, body) =>{
            if (error || response.statusCode>=400){
                if (error){
                    console.error('request cb error', error);
                    return reject('failed to connect, server might be down');
                }else{
                    const bodyObj = JSON.parse(body) ;
                    console.error('request cb error body', bodyObj);
                    return reject(bodyObj.title);
                }
            }

            if (response && response.headers && response.headers['x-user-context']){
                const userContextString = response.headers['x-user-context'];
                const userContext = JSON.parse(decodeURI(userContextString));
                const groups= JSON.parse(body).results;

                return resolve({groups, userContext, provider, token});
            } else{
                console.error('request cb no header');

                return reject('server response is missing the user context');
            }
        });
    })
};

export default login;
