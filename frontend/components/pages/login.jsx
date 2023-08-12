
import { OAuth2Client } from '@byteowls/capacitor-oauth2'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import React, { Component } from 'react';
import Card from '../ui/Card';
import { IonContent, IonText, IonRow, IonCol, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonImg } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import "@codetrix-studio/capacitor-google-auth";


  // src/services/gmail-authentication.js
  GoogleAuth.initialize({
    clientId: '48479698491-eggd5u6iebahkm5kakb9q81s9pme1j37.apps.googleusercontent.com',
    scopes: [' https://mail.google.com/'],
    grantOfflineAccess: true,
  });

  const INITIAL_STATE = {



  };

  class Login extends Component {
    constructor(props) {
      super(props);
      this.state = { ...INITIAL_STATE };
    }
  
    async signIn() {
      const { history } = this.props;
      console.log(history)
      const result = await GoogleAuth.signIn();
      console.info('result', result);
      if (result) {
        console.log('pushing')
        history.push({
          pathname: '/Home',
          state: { name: result.givenName, image: result.imageUrl, email: result.email, token: result.authentication.accessToken }
          
        });
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
  
  export default Login;





