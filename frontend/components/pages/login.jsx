
import { OAuth2Client } from '@byteowls/capacitor-oauth2'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import React, { Component } from 'react';
import Card from '../ui/Card';
import { IonContent, IonText, IonRow, IonCol, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonImg } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import "@codetrix-studio/capacitor-google-auth";
import { useHistory } from 'react-router-dom'
import { withRouter } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { CapacitorCookies } from '@capacitor/core';
import { CapacitorHttp } from '@capacitor/core';
const isAndroid = Capacitor.getPlatform() === 'android';

let client;


      if (isAndroid) {
        // Android direct API call
        client = '597005595484-tgc3ks9dff3qt9moup9ih752b1v64jml.apps.googleusercontent.com';
      } else {
        // Browser reverse proxy
        client = '48479698491-eggd5u6iebahkm5kakb9q81s9pme1j37.apps.googleusercontent.com'; 
      }

  // src/services/gmail-authentication.js
  GoogleAuth.initialize({
    clientId: client,
    scopes: [' https://mail.google.com/'],
    grantOfflineAccess: true,
  });

  console.log(isAndroid)
  const INITIAL_STATE = {



  };

  class Login extends Component {
    constructor(props) {
      super(props);
      this.state = { ...INITIAL_STATE };
    }
  
    async signIn() {
      const {history} = this.props
      const result = await GoogleAuth.signIn();
    
      console.info('result', result);

      console.info(result);
    
      let apiUrl;

      if (isAndroid) {
        // Android direct API call
        apiUrl = 'http://192.168.39.115:9000/api/store';
      } else {
        // Browser reverse proxy
        apiUrl = '/api/store'; 
      }
      
      const options ={
        url: apiUrl,
        headers: {'Content-Type': 'application/json', 'credentials': 'include',},
        data: JSON.stringify(result)
      }
    
      if (result) {
        const response = await CapacitorHttp.post(options)
console.log(response)
  
const sessionId = response.data.sessionId;
      
          console.log(sessionId)
          ;
       if(isAndroid){

          document.cookie = `info=${sessionId}; path=/; Secure; SameSite=None; max-age=360000000`;
       }
  console.log('cookies stored')

        
history.push('/Home')
      }
    }
  
    render() {
      return (
        <>
          <IonPage>
            <IonHeader translucent={true}>
              <IonToolbar>
                <IonTitle className='ion-text-center'>Login</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent className='flex items-center justify-center'>
              <IonHeader collapse="condense">
                <IonToolbar>
                  <IonTitle size="large" className='ion-text-center'>Login</IonTitle>
                </IonToolbar>
              </IonHeader>
              <h2 className='ion-text-center'>Gamer Mail</h2>
              <IonImg src="https://i.ibb.co/CwsqWsZ/raern.png"></IonImg>
              <IonButton className="login-button" onClick={() => this.signIn()} expand="block" fill="solid" color="primary">Login</IonButton>
              
            </IonContent>
          </IonPage>
        </>
      );
    }
  }
  
  export default withRouter(Login);





