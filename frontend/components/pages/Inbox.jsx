import { Redirect, Route } from 'react-router-dom';
import { IonContent, IonText, IonRow, IonItem, IonThumbnail, IonLabel, IonCol, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonImg } from '@ionic/react';
import React, { Component, useEffect, useState } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { cog, flash, list, eye } from 'ionicons/icons';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { withRouter } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import Lists from './Lists';
import ListDetail from './ListDetail';
import Settings from './Settings';
import Login from './login';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmailsSuccess, fetchEmailsFailure } from '../../android/inboxSlice'




const isAndroid = Capacitor.getPlatform() === 'android';


const INITIAL_STATE = {
  loggedIn: true,
  user: {}
};


class Inbox extends Component {
  
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }


  async getMail() {

 
    
    
      useEffect(() => {
        async function fetchEmails() {
          try {
            const options ={
              method: "Get",
            headers: {'Content-Type': 'application/json',
             'credentials': 'include',
             'authorization': 'include'
            },
            }
      
            const response = await fetch(`/api/mail`, options);
            if (response.ok) {
              const mailDataPromise = await response.json(); 
      const mailData = mailDataPromise.messageIds
        console.log(mailData)
      
              const fetchedEmails = [];
              for (const emails of mailData) {
                const options2 ={
                  method: "post",
                headers: {'Content-Type': 'application/json',
                 'credentials': 'include',
                 'authorization': 'include'
                },
                body: JSON.stringify({emails})
                }
                const emailContent = await fetch('/api/mail/content', options2);
                const emailData = await emailContent.json();
                fetchedEmails.push(emailData);
              }
      
              dispatch(fetchEmailsSuccess(fetchedEmails));
            } else {
              dispatch(fetchEmailsFailure('Failed to retrieve emails'));
            }
          } catch (error) {
            dispatch(fetchEmailsFailure('Error fetching emails'));
          }
        }
      }, [dispatch]);}

 
  async signOut() {
    const { history } = this.props;
    await GoogleAuth.signOut();
    history.goBack();
  }

 

 async getUserData() {
  console.log('trying')
    try {
      const options = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'credentials': 'include',
          'authorization': 'include'
        },
      };
      let apiUrl;

      if (isAndroid) {
        // Android direct API call
        apiUrl = 'http://192.168.39.115:9000/api/user';
      } else {
        // Browser reverse proxy
        apiUrl = '/api/user'; 
      }

      const response = await fetch(apiUrl, options);

      if (response.ok) {
        const userData = await response.json();
        const userInfo = userData.userInfo[0]
      
        const email = userInfo.email
     
       this.setState({ user: userInfo }); // Update the component state with user data
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  
 


  render() {
   
    const { user, email } = this.state;

    return (
      <IonPage>
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle className='text-center'>Inbox</IonTitle>
            <IonItem  color="primary">
            <img src={user.image_url} alt="User" />
            <IonLabel className='ion-padding-start'>
                <h3>{user.username}</h3>
                <p>{user.email}</p>
              </IonLabel>
              <IonButton className="login-button" onClick={() => this.getMail()}  fill="solid" color="tertiary">
           Mail
          </IonButton>
              <IonButton className="login-button" onClick={() => this.signOut()}  fill="solid" color="danger">
           home
          </IonButton>

          
            </IonItem>

          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">

          <IonRow>
            <IonCol className="text-center">
              <IonText className="title">
                
              </IonText>
            </IonCol>
          </IonRow>

          

        
          
        </IonContent>
      </IonPage>
      </IonPage>
    );
  }
}

export default withRouter(Inbox);




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



useEffect(() => {
  async function fetchEmails() {
    try {
      const options ={
        method: "Get",
      headers: {'Content-Type': 'application/json',
       'credentials': 'include',
       'authorization': 'include'
      },
      }

      const response = await fetch(`/api/mail`, options);
      if (response.ok) {
        const mailDataPromise = await response.json(); 
const mailData = mailDataPromise.messageIds
  console.log(mailData)

        const fetchedEmails = [];
        for (const emails of mailData) {
          const options2 ={
            method: "post",
          headers: {'Content-Type': 'application/json',
           'credentials': 'include',
           'authorization': 'include'
          },
          body: JSON.stringify({emails})
          }
          const emailContent = await fetch('/api/mail/content', options2);
          const emailData = await emailContent.json();
          fetchedEmails.push(emailData);
        }

        // Dispatch actions using Redux Toolkit's action creators
        dispatch(fetchEmailsSuccess(fetchedEmails));
      } else {
        dispatch(fetchEmailsFailure('Failed to retrieve emails'));
      }
    } catch (error) {
      dispatch(fetchEmailsFailure('Error fetching emails'));
    }
  }
}, [dispatch]);

// async componentDidMount() {
    

//   await this.getUserData();
// await this.getMail()
// }