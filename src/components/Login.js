
import React, { Component } from 'react';
import FacebookLogin from  'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';

import login from '../actions/login';

import Loader from "../containers/Loading";
import { version } from '../../package.json';

const ONE_DAY = 1000 * 60 * 60 * 24;
const GOOGLE_CLIENT_ID = "323527955387-rpt6jpjmdeputfkggi5v5gf5cl99ontb.apps.googleusercontent.com";
const FACEBOOK_APP_ID = "568337437281618";
class Login extends Component {

    constructor() {
        super();
        this.state = { error: null };
    }

    onFailure = (error) => {
        console.error('App onFailure', error);
        this.setState({ error });
    };

    performLogin = async (provider, token, showError = true) => {
        try{
            console.log(provider, token);
            const result = await login(provider, token);
            const authData = localStorage.getItem('authData');
            const issueDate  = authData ? JSON.parse(authData).issueDate : new Date();
            localStorage.setItem('authData', JSON.stringify({provider, token, issueDate }));
            return this.props.onLogin(result);


        } catch(error) {
            localStorage.removeItem('authData');
            if (showError){
                return this.onFailure(error);
            } else{
                return this.onFailure(null);
            }
        }
    };

    facebookResponse = (response) => {
        if (response.accessToken){
            console.log('token:',response.accessToken)
            this.performLogin('facebook', response.accessToken, true);
        }else{
            this.onFailure('login failed')
        }

    };

    googleResponse = (response) => {
        if (response.accessToken){
            this.performLogin('google', response.accessToken, true);
        }else{
            this.onFailure('login failed')
        }

    };

    render() {
        const authData = localStorage.getItem('authData');
        if (authData){
            const {provider, token, issueDate } = JSON.parse(authData);
            const timePassed = (new Date()).getTime() - (new Date(issueDate)).getTime();
            if (timePassed > ONE_DAY){
                localStorage.removeItem('authData');
            } else{
                this.performLogin(provider, token, false);
                return <Loader />;
            }
        }
        const google = (<GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            onSuccess={this.googleResponse}
            onFailure={this.onFailure}
            render={renderProps => (
                <div className="login-button" onClick={renderProps.onClick}> LOGIN WITH GOOGLE</div>
            )}
        />);

         const facebook = ( <FacebookLogin
            disableMobileRedirect={true}
            appId={FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,email,picture"
            callback={this.facebookResponse}
            render={renderProps => (
                <div className="login-button" onClick={renderProps.onClick}> LOGIN WITH FACEBOOK</div>
            )}
        />);

        return (
            <div id="login-page">

                <img id="rect-img" src="rect.png" alt='rect'/>
                <img id="hand-img" src="hand.png" alt='hand'/>
                <div id="login-space1"/>
                <span className="login-app-name">IM</span> <span className="login-app-name-space"> _</span><span className="login-app-name">IN</span>
                <div id="login-space2"/>
                {facebook}
                {google}

                <div id="loginErrorSection">
                    {this.state.error ? this.state.error : ''}
                </div>
                <div id="version">
                    version: {version}
                </div>
            </div>
        );

    }
}

export default Login;

