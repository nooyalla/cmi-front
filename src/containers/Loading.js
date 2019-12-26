
import React, { Component } from 'react';

export default class Loader extends Component {
    render() {
        return  (
            <div id="loader">
                <div id="loader-app-name"><b>
                    ImIN
                </b></div>
                <img id="loaderImage"  src="loading.gif" alt='loading'/>

                <div id="please-wait">please wait</div>
            </div>
        );
    }
}
