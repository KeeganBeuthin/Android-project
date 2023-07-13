import { IonApp, IonLabel, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonIcon  } from '@ionic/react';
import { cog, flash, list } from 'ionicons/icons';
import { StatusBar, Style } from '@capacitor/status-bar';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context'

import Feed from './pages/Feed';
import Lists from './pages/Lists';
import ListDetail from './pages/ListDetail';
import Settings from './pages/Settings';
import Tabs from './pages/Tabs';

setupIonicReact({});

window.matchMedia("(prefers-color-scheme: dark)").addListener(async (status) => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light,
    });
  } catch {}
});
const oidcConfig = {
  authority: "http://localhost:4000",
  client_id: "client",
  client_secret: '8535thldsfjgh09p34yoisvldfsgbljr',
  redirect_uri: "http://localhost:3000",
  
};
const AppShell = () => {
  return (
    
    <AuthProvider {...oidcConfig}>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route path="/tabs" render={() => <Tabs />} />
          <Route path="/" render={() => <Redirect to="/tabs/feed" />} exact={true} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
    </AuthProvider>
  );
};

export default AppShell;
