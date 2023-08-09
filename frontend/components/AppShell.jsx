import { IonApp, IonLabel, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonIcon  } from '@ionic/react';
import { cog, flash, list } from 'ionicons/icons';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IonButton } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useAuth,AuthProvider } from '../src';
import * as React from "react";
import * as ReactDOM from "react-dom";
import Feed from './pages/Feed';
import Lists from './pages/Lists';
import ListDetail from './pages/ListDetail';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Login from './pages/login';

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
  redirect_uri: 'http://localhost:3000',
};
function LoginButton(){
  const [isButtonClicked, setIsButtonClicked] = React.useState(false);

  const handleClick = () => {
    setIsButtonClicked(true);
    
    void auth.signinRedirect();
    ;
  };
  
  const auth = useAuth();
  console.log('auth called')
  console.log(auth.error)
  return(

     <>
      <IonButton onClick={handleClick}>Log in</IonButton>
      {isButtonClicked && <p>Button has been pressed</p>}
    </>
  )
}

// function Login() {
 
//   const auth = useAuth()


//   if (auth.isAuthenticated) {
//     console.log('authenticated');
//     return (
//       <IonApp>
//   <IonReactRouter>
//         <IonRouterOutlet id="main">
//           <Route path="/tabs" render={() => <Tabs />} />
//           <Route path="/" render={() => <Redirect to="/tabs/feed" />} exact={true} />
//         </IonRouterOutlet>
//       </IonReactRouter>
//       </IonApp>
//     );
//   }

//   if (auth.isLoading){
//     return <div>Loading...</div>
//   }

 
//   return (
//     <>
//     <IonApp>
//       <IonReactRouter>
//     <h1>please Login</h1>
//     <LoginButton/>
//     </IonReactRouter>
//     </IonApp>
//   </>
//   )
// }





console.log(Home)
const AppShell = () => {
  return (
    <IonApp>
      <IonReactRouter >
        <IonRouterOutlet id="main">
          <Switch>
          <Route path="/Home" render={() => <Home/>} />
          <Route path="/" component={Login} />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
