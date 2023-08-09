import { Redirect, Route } from 'react-router-dom';
import { IonContent, IonText, IonRow, IonItem, IonThumbnail, IonLabel, IonCol, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonImg } from '@ionic/react';
import React, { Component } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { cog, flash, list, eye } from 'ionicons/icons';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { withRouter } from 'react-router-dom';

import Lists from './Lists';
import ListDetail from './ListDetail';
import Settings from './Settings';
import Login from './login';

GoogleAuth.initialize({
  clientId: '48479698491-eggd5u6iebahkm5kakb9q81s9pme1j37.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  grantOfflineAccess: true,
});
const INITIAL_STATE = {
  loggedIn: true,
  user: {}
};

const options ={
  method: "Get",
headers: {'Content-Type': 'application/json', 'credentials': 'include',
},
body: JSON.stringify()
}


class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }



  componentDidMount() {
    this.getUserInfo();
  }
 
  async signOut() {
    const { history } = this.props;
    await GoogleAuth.signOut();
    history.goBack();
  }

  async getUserInfo() {
    console.log(this.props.location.state.token)
    this.setState({
      user: {
        name: this.props.location.state.name,
        image: this.props.location.state.image,
        email: this.props.location.state.email,
        AccessToken: this.props.location.state.token
      }
    });
  }
  
  async getMail(){
    console.log(this.props.location.state.token)
    console.log(options)
  const mail= await fetch(`http://localhost:9000/api/mail`,options, )
  console.log(mail)
  }
  render() {
    console.log('I am present')
    return (
      <IonPage>
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Logged in ... </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">

          <IonRow>
            <IonCol className="text-center">
              <IonText className="title">
                You are logged in !
              </IonText>
            </IonCol>
          </IonRow>

          {this.state.user.name &&
            <IonItem>
              <IonThumbnail slot="start">
                <img src={this.state.user.image} alt="User" />
              </IonThumbnail>
              <IonLabel>
                <h3>{this.state.user.name}</h3>
                <p>{this.state.user.email}</p>
              </IonLabel>
            </IonItem>
          }

          <IonButton className="login-button" onClick={() => this.signOut()} expand="full" fill="solid" color="danger">
            Logout from Google
          </IonButton>
          
          <IonButton  onClick={() => this.getMail()} expand="full" fill="solid" color="primary">
            mail
          </IonButton>
        </IonContent>
      </IonPage>
      </IonPage>
    );
  }
}

export default withRouter(Home);




// const Tabs = () => {
//   return (
//     <IonTabs>
//       <IonRouterOutlet>
//         <Route path="/tabs/settings" render={() => <Settings />} exact={true} />
//         <Route path="/tabs/inbox" render={() => <Inbox />} exact={true} />
//       </IonRouterOutlet>
//       <IonTabBar slot="bottom">
//         <IonTabButton tab='tab4' href='/tabs/inbox'>
//         <IonIcon icon={eye}/>
//         <IonLabel>Inbox</IonLabel>
//         </IonTabButton>
//         <IonTabButton tab="tab3" href="/tabs/settings">
//           <IonIcon icon={cog} />
//           <IonLabel>Settings</IonLabel>
//         </IonTabButton>
//       </IonTabBar>
//     </IonTabs>
//   );
// };
