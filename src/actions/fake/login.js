import events from './events';
const response = {
    events,
    userContext: {
        firstName: 'gilad',
        familyName: 'green',
        email: 'gilad.green@autodesk.com',
        image: 'https://lh3.googleusercontent.com/a-/AAuE7mAyuOJTvxfYVFwxKOd-h58A8Oxm1EVSf8OjpkSC3uk',
    }
};

async function login(provider, token){
        return new Promise((resolve,reject)=>{
            return resolve({ ...response, provider, token });
        })
};

export default login;
