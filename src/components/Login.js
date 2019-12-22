import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from '../config';
import React, { Component } from 'react';
import FacebookLogin from  'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import login from '../actions/fake/login';
//import login from '../actions/login';
import Loader from "../containers/Loading";
import { version } from '../../package';
const ONE_DAY = 1000 * 60 * 60 * 24;
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
                <button id="google-login-button"  className="login-button"  onClick={renderProps.onClick}>Sign in with Google</button>
            )}
        />);

         const facebook = ( <FacebookLogin
            appId={FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,email,picture"
            callback={this.facebookResponse}
            render={renderProps => (
                <button id="facebook-login-button" className="login-button" onClick={renderProps.onClick}>Sign in with Facebook</button>
            )}
        />);

        return (
            <div id="login-page">
                <div id="login-header-div">
                    <div id="login-header">
                        CMI
                    </div>
                </div>
                <div id="login-text">
                   LOG IN TO <b> CMI</b>
                </div>
                <div>
                    <div id="space-before-login-buttons">
                    </div>
                    <div>
                        {facebook}
                    </div>
                    <div id="space-between-login-buttons">
                    </div>
                    <div>
                        {google}
                    </div>
                </div>
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

