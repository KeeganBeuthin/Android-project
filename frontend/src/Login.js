import { IonApp, IonLabel, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonIcon  } from '@ionic/react';
import { cog, flash, list } from 'ionicons/icons';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IonButton } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { useAuth,AuthProvider } from '../src';
import * as React from "react";
import * as ReactDOM from "react-dom";

import Lists from './pages/Lists';
import ListDetail from './pages/ListDetail';
import Settings from './pages/Settings';
import Tabs from './pages/Tabs';


function LoginButton(){
    const auth = useAuth();
    console.log('auth called')
    return(
      <IonButton onClick={() => void auth.signinRedirect()}>Log in</IonButton>
    )
  }
  
  export function Login() {
   
    const auth = useAuth()
  
  
    if (auth.isAuthenticated) {
      console.log('authenticated');
      return (
        <IonApp>
    <IonReactRouter>
          <IonRouterOutlet id="main">
            <Route path="/tabs" render={() => <Tabs />} />
            <Route path="/" render={() => <Redirect to="/tabs/feed" />} exact={true} />
          </IonRouterOutlet>
        </IonReactRouter>
        </IonApp>
      );
    }
  
   
    return (
      <>
      <IonApp>
        <IonReactRouter>
      <h1>please Login</h1>
      <LoginButton/>
      </IonReactRouter>
      </IonApp>
    </>
    )
  }