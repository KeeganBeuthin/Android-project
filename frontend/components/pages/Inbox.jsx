import { Redirect, Route } from 'react-router-dom';
import { IonContent, IonText, IonRow, IonItem, IonThumbnail, IonLabel, IonCol, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonImg, IonGrid } from '@ionic/react';
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
import { fetchEmailsRequest, fetchEmailsSuccess, fetchEmailsFailure } from '../../android/redux/inboxSlice';
import { connect } from 'react-redux';



const isAndroid = Capacitor.getPlatform() === 'android';


const INITIAL_STATE = {
  loggedIn: true,
  user: {}
};

const ITEMS_PER_PAGE = 10; 


const Inbox = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [emailPages, setEmailPages] = useState([]);
  const [allEmails, setAllEmails] = useState([]); 



    async function fetchEmails(pageToken) {

  
      try {
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'credentials': 'include',
            'authorization': 'include'
          },
        };
        const url = `/api/mail?pageToken=${pageToken || ''}`
        const response = await fetch(url, options);
        if (response.ok) {
          const mailDataPromise = await response.json();
          const mailData = mailDataPromise.messageIds;
          const nextPageToken = mailDataPromise.nextPageToken
         
          setNextPageToken(nextPageToken);
          console.log(nextPageToken)
          const fetchedEmails = [];
          for (const messageId of mailData) {
            const options2 = {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                'credentials': 'include',
                'authorization': 'include'
              },
              body: JSON.stringify({ emails: messageId }) 
            };
            const emailContent = await fetch('/api/mail/content', options2);
            const emailData = await emailContent.json();

            fetchedEmails.push(emailData.emailContent); 
            console.log(emailData.emailContent)
          }

          const updatedEmailPages = [...emailPages];
          updatedEmailPages[currentPage - 1] = fetchedEmails;
          setEmailPages(updatedEmailPages);
          setAllEmails(prevEmails => [...prevEmails, ...fetchedEmails]);
          dispatch(fetchEmailsSuccess(fetchedEmails)); 
        } else {
          dispatch(fetchEmailsFailure('Failed to retrieve emails'));
        }
      } catch (error) {
        dispatch(fetchEmailsFailure('Error fetching emails'));
      }
    }
   
  

  const [userData, setUserData] = useState(null);


  useEffect(() => {
    async function getUserData() {
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
          const userInfo = userData.userInfo[0];

        
          setUserData(userInfo);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    getUserData();
    fetchEmails()
  }, []);




  useEffect(() => {
    if (userData) {
      const updatedEmailPages = [];
      for (let i = 0; i < allEmails.length; i += ITEMS_PER_PAGE) {
        updatedEmailPages.push(allEmails.slice(i, i + ITEMS_PER_PAGE));
      }
      setEmailPages(updatedEmailPages);

      
    

    }
  }, [userData, allEmails]);



  const emails = useSelector(state => state.inbox.emails);



    async function signOut() {
      const { history } = this.props;
      await GoogleAuth.signOut();
      history.goBack();
    }


    console.log(userData)
    if (!userData) {
     
      return <div>Loading...</div>;
    }

  


if(emails == undefined){
  return <div>loading...</div>
}

console.log(emails)

const loadNextPage = async () => {
  if (nextPageToken && !emailPages[currentPage]) {
    await fetchEmails(nextPageToken);
    setCurrentPage(currentPage + 1);
  } else {
    setCurrentPage(currentPage + 1);
  }
};

const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  
  const emailsToShow = emailPages[currentPage - 1] || [];

  return (
    
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className='text-center'>Inbox</IonTitle>
          <IonItem  color="primary">
          <img src={userData.image_url} alt="User" />
          <IonLabel className='ion-padding-start'>
              <h3>{userData.username}</h3>
              <p>{userData.email}</p>
            </IonLabel>
            
            <IonButton className="login-button" onClick={() => signOut()}  fill="solid" color="danger">
         home
        </IonButton>
        <IonButton className="login-button" onClick={() => fetchEmails()}  fill="solid" color="tertiary">
         mail
        </IonButton>
          </IonItem>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

      <IonGrid>

          <IonRow>
            <IonCol>Date</IonCol>
            <IonCol>Subject</IonCol>
            <IonCol>Snippet</IonCol>
          </IonRow>
          
    
          {emailPages[currentPage - 1]?.map((email, index) => (
            <IonRow key={index}>
              <IonCol>{email.date}</IonCol>
              <IonCol>{email.subject}</IonCol>
              <IonCol>{email.snippet}</IonCol>
            </IonRow>
          ))}
        </IonGrid>

       
        <IonRow>
          <IonCol className="ion-text-center">
            <IonButton
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous Page
            </IonButton>
            <IonButton
              onClick={() => loadNextPage()}

            >
              Next Page
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>

  );
}

export default withRouter(Inbox);





