import { Redirect, Route } from 'react-router-dom';
import { IonContent, IonText, IonRow, IonItem, IonThumbnail, IonLabel, IonCol, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonImg } from '@ionic/react';
import React, { Component } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { cog, flash, list, eye } from 'ionicons/icons';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { withRouter } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import Lists from './Lists';
import ListDetail from './ListDetail';
import Settings from './Settings';
import Login from './login';
import { CapacitorHttp } from '@capacitor/core';

const isAndroid = Capacitor.getPlatform() === 'android';


const INITIAL_STATE = {
  loggedIn: true,
  user: {},
  isLoading: true
};



class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }


 
  async signOut() {
    const { history } = this.props;
    await GoogleAuth.signOut();
    history.goBack();
  }

  async componentDidMount() {
    

    await this.getUserData();
  }

 async getUserData() {
    try {
      console.log(isAndroid)
      let apiUrl;

      if (isAndroid) {
        // Android direct API call
        apiUrl = 'http://192.168.39.115:9000/api/user';
      } else {
        // Browser reverse proxy
        apiUrl = '/api/user'; 
      }

      const options = {
        url: apiUrl,
        headers: {
          'Content-Type': 'application/json',
          'credentials': 'include',
          'authorization': 'include'
        },
      };

      const response = await CapacitorHttp.get(options);

      if (response.status === 200) {
      
        
        const userInfo = await response.data.userInfo[0]
     
    this.setState({ user: userInfo, isLoading: false })
       console.log('hello', this.state.user);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  
  async getMail(){
    const options ={
      method: "Get",
    headers: {'Content-Type': 'application/json',
     'credentials': 'include',
     'authorization': 'include'
    },
    }
   
  const mail= await fetch(`/api/mail`,options, )
  console.log(mail)
  }

  async Inbox(){
    const {history} = this.props
    history.push('/Inbox')
  }

  async Test(){
    const options ={
      method: "Get",
    headers: {'Content-Type': 'application/json',
     'credentials': 'include',
     'authorization': 'include'
    },
    }

    const mailTest = await fetch('/api/store/token', options)
    console.log(mailTest)
  }

  
  render() {


    const { user, isLoading } = this.state;


    if (isLoading ===true) {
     console.log('loading')
      return <div>Loading...</div>;
    }
   
  

    return (
      <IonPage>
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Logged in</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">

          <IonRow>
            <IonCol className="text-center">
              <IonText className="title">
           
              </IonText>
            </IonCol>
          </IonRow>

          {user.username &&
            <IonItem>
              <IonThumbnail slot="start">
                <img src={user.image_url} alt="User" />
              </IonThumbnail>
              <IonLabel>
                <h3>{user.username}</h3>
                <p>{user.email}</p>
              </IonLabel>
            </IonItem>
          }

          <IonButton className="login-button" onClick={() => this.signOut()} expand="full" fill="solid" color="danger">
            Logout from Google
          </IonButton>
          
          <IonButton  onClick={() => this.Inbox()} expand="full" fill="solid" color="primary">
            mail
          </IonButton>

          <IonButton  onClick={() => this.Test()} expand="full" fill="solid" color="tertiary">
            test
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
