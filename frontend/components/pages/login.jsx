
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
  // src/services/gmail-authentication.js
  GoogleAuth.initialize({
    clientId: '48479698491-eggd5u6iebahkm5kakb9q81s9pme1j37.apps.googleusercontent.com',
    scopes: [' https://mail.google.com/'],
    grantOfflineAccess: true,
  });
  const isAndroid = Capacitor.getPlatform() === 'android';
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

      const options ={
        method: "Post",
        headers: {'Content-Type': 'application/json', 'credentials': 'include',},
        body: JSON.stringify(result)
      }
    
      let apiUrl;

      if (isAndroid) {
        // Android direct API call
        apiUrl = 'http://192.168.39.115:9000/api/store';
      } else {
        // Browser reverse proxy
        apiUrl = '/api/store'; 
      }
      
    
      if (result) {
         await fetch(apiUrl,options)
        history.push('/Home')
      ;
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





