import { Redirect, Route } from 'react-router-dom';
import { IonContent, IonText, IonRow, IonItem, IonThumbnail, IonLabel, IonCol, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonImg, IonGrid,IonButtons,IonMenuButton, IonModal, IonInput } from '@ionic/react';
import React, { Component, useEffect, useState, useRef } from 'react';
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
import { useHistory } from 'react-router-dom';
import EmailForm from './popup';
import Image from 'next/image'
import { CapacitorHttp } from '@capacitor/core';
const isAndroid = Capacitor.getPlatform() === 'android';

console.log(isAndroid)
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
  const [modal, setModal] = useState(null);
  const [input, setInput] = useState(null);
  const [message, setMessage] = useState(
    'This modal example uses triggers to automatically open a modal when the button is clicked.'
  );

  const [inputRecipient, setInputRecipient] = useState(null);
const [inputSubject, setInputSubject] = useState(null);
const [inputBody, setInputBody] = useState(null);
const [inputAttachments, setInputAttachments] = useState(null);
const [inputCC, setInputCC] = useState(null);
const [showModal, setShowModal] = useState(false);
const fileInputRef = useRef(null);
const [selectedFiles, setSelectedFiles] = useState([]);

 const history = useHistory()
 
 const isAndroid = Capacitor.getPlatform() === 'android';

 const emails = useSelector(state => state.inbox.emails);


    async function fetchEmails(pageToken) {

  
      try {
      

       let apiUrl

       if(isAndroid){
        apiUrl = `http://192.168.39.115:9000/api/mail?pageToken=${pageToken || ''}`
       }
        else{
          apiUrl =`/api/mail?pageToken=${pageToken || ''}` 
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
  

        if (response.status ===200||304) {
  
          const mailData = response.data.messageIds
  console.log(mailData)
          const nextPageToken = response.data.nextPageToken
         
          setNextPageToken(nextPageToken);
      

          const fetchedEmails = [];


          let postUrl


          if(isAndroid){
            postUrl = `http://192.168.39.115:9000/api/mail/content`
          } else {
            postUrl = '/api/mail/content'
          }
console.log(mailData)

          for (const messageId of mailData) {
            console.log(messageId)
            const options2 = {
              url: postUrl,
              headers: {
                'Content-Type': 'application/json',
                'credentials': 'include',
                'authorization': 'include'
              },
              data: {'email':messageId}
            };

        console.log('trying')
            const emailContent = await CapacitorHttp.post(options2);
        

            const emailData = emailContent.data.emailContent
            console.log(emailData)
            fetchedEmails.push(emailData); 
          
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

        if (response.status === 200||304) {
          
       const userInfo = await response.data.userInfo[0]
        
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








    async function signOut() {
      await GoogleAuth.signOut();
      history.push('/home');
    }


    if (!userData) {
     
      return <div>Loading...</div>;
    }

  


if(emails == undefined){
  return <div>loading...</div>
}



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
  
  


  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
    e.target.value = null;
  };
 


    async function sendEmail() {
      try {

        function readFileAsBase64(file) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
        
            reader.onload = (event) => {
              const base64Data = event.target.result.split(',')[1]; // Extract base64 data part
              resolve(base64Data);
            };
        
            reader.onerror = (error) => {
              reject(error);
            };
        
            reader.readAsDataURL(file); // Read the file as data URL (base64)
          });
        }

   const emailPayload = {
    'to': inputRecipient.value,
    'subject': inputSubject.value,
    'content': inputBody.value,
    'cc': inputCC.value,
    'attachments': []
  };

const attach = selectedFiles


if (attach.length > 0) {
  for (const file of attach) {
    // Read the file data as a base64-encoded string
    const base64Data = await readFileAsBase64(file);

    // Create an object for each attachment with filename and base64 data
    emailPayload.attachments.push({
      filename: file.name,
      data: base64Data
    });
  }


 const formData = JSON.stringify(emailPayload)

console.log(emailPayload)
  
let apiUrl 

if(isAndroid){
  apiUrl = 'http://192.168.39.115:9000/api/send'
} else{
  apiUrl = '/api/send'
}


const options ={
  url: apiUrl,
  headers: {'Content-Type': 'application/json', 'credentials': 'include',},
  data: formData
}


  const response = await CapacitorHttp.post(options); 
  console.log(response)
  if (response.status===200) {
  
    setMessage(`Email sent successfully to ${inputRecipient.value}`);
    modal.dismiss();
  } else {

    setMessage('Failed to send email');

  }

}
      
   
else{

  let apiUrl 

if(isAndroid){
  apiUrl = 'http://192.168.39.115:9000/api/send'
} else{
  apiUrl = '/api/send'
}


  const options ={
    url: apiUrl,
    headers: {'Content-Type': 'application/json', 'credentials': 'include',},
    data: emailPayload
  }


const response = await CapacitorHttp.post(options); 
console.log(response)
if (response.status===200) {

  setMessage(`Email sent successfully to ${inputRecipient.value}`);
  modal.dismiss();
} else {

  setMessage('Failed to send email');

}

}
       
      } catch (error) {
        setMessage('Error sending email');
        console.error('Error sending email:', error);
      }
    }
  


  function onWillDismiss(ev) {
    if (ev.detail.role === 'confirm') {
      setMessage(`Email sending in progress...`);
    }
  }

  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };
if(isAndroid){
  return (
    <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle className='text-center'>Inbox</IonTitle>
        <IonItem color="primary">
          <img src={userData.image_url} alt="User" />
          <IonLabel className='ion-padding-start'>
            <h3>{userData.username}</h3>
            <p>{userData.email}</p>
          </IonLabel>

          <IonButton className="login-button" onClick={() => signOut()} fill="solid" color="danger">
            home
          </IonButton>
          
          <IonButton id="open-modal" expand="block" color='tertiary' > 
            Send Mail
          </IonButton>
          <IonModal ref={(ref) => setModal(ref)}
          trigger="open-modal"
          onWillDismiss={(ev) => onWillDismiss(ev)}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Send Emails</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => sendEmail()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Recipient</IonLabel>
              <IonInput ref={(ref) => setInputRecipient(ref)}
                type="text"
                placeholder="example@gmail.com"
              />
               </IonItem>
               <IonItem>
              <IonLabel position="stacked">CC</IonLabel>
              <IonInput ref={(ref) => setInputCC(ref)}
                type="text"
                placeholder="example2@gmail.com"
              />
               </IonItem>
               <IonItem>
              <IonLabel position="stacked" className='py-5'>Subject</IonLabel>
               <IonInput ref={(ref) => setInputSubject(ref)}
                type="text"
                placeholder="Greetings"
              />
               </IonItem>
               <IonItem>
              <IonLabel position="stacked" className='py-5 text-lg'>Body</IonLabel>
               <IonInput ref={(ref) => setInputBody(ref)}
                type="text"
                placeholder="how are you?"
              />
               </IonItem>
               <IonItem>
              <IonLabel position="stacked" className='py-5 text-lg'>Attachments</IonLabel>
        
    <ul>
      {selectedFiles.map((file, index) => (
        <li key={index}>{file.name} 
         <button onClick={() => removeFile(index)} className='px-3 pt-2 col'><IonImg src="https://i.ibb.co/k1BVnnB/cross.png" className='w-8 h-8'></IonImg></button>
         </li>
        
      ))}

    </ul>
              <IonButton onClick={openModal} id="uploadButton">Upload Files</IonButton>
              <IonContent>
        <IonModal isOpen={showModal} onDidDismiss={closeModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Upload Files</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form encType='multipart/form-data'>
              <input
                type="file"
                name='file'
                ref={fileInputRef}
                accept="image/*, video/*"
                onChange={handleFileInputChange}
                multiple
              />
            </form>
            <IonButton onClick={closeModal}>Close Modal</IonButton>
          </IonContent>
        </IonModal>
        </IonContent>
            </IonItem>
          </IonContent>
        </IonModal>
        </IonItem>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
    <IonGrid style={{ border: '4px solid black' }}>
  {emailPages[currentPage - 1]?.map((email, index) => (
    <IonRow key={index} style={{ borderBottom: '4px solid black'}}>
      <IonCol size="12" className="email-cell">
        <div><strong>Mail ID:</strong> {email.mailId}</div>
        <div><strong>Date:</strong> {email.date}</div>
        <div><strong>Subject:</strong> {email.subject}</div>
        <div><strong>Snippet:</strong> {email.snippet}</div>
      </IonCol>
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
  )
}
  return (
    <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle className='text-center'>Inbox</IonTitle>
        <IonItem color="primary">
          <img src={userData.image_url} alt="User" />
          <IonLabel className='ion-padding-start'>
            <h3>{userData.username}</h3>
            <p>{userData.email}</p>
          </IonLabel>

          <IonButton className="login-button" onClick={() => signOut()} fill="solid" color="danger">
            home
          </IonButton>
          
          <IonButton id="open-modal" expand="block" color='tertiary' > 
            Send Mail
          </IonButton>
          <IonModal ref={(ref) => setModal(ref)}
          trigger="open-modal"
          onWillDismiss={(ev) => onWillDismiss(ev)}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Send Emails</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => sendEmail()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Recipient</IonLabel>
              <IonInput ref={(ref) => setInputRecipient(ref)}
                type="text"
                placeholder="example@gmail.com"
              />
               </IonItem>
               <IonItem>
              <IonLabel position="stacked">CC</IonLabel>
              <IonInput ref={(ref) => setInputCC(ref)}
                type="text"
                placeholder="example2@gmail.com"
              />
               </IonItem>
               <IonItem>
              <IonLabel position="stacked" className='py-5'>Subject</IonLabel>
               <IonInput ref={(ref) => setInputSubject(ref)}
                type="text"
                placeholder="Greetings"
              />
               </IonItem>
               <IonItem>
              <IonLabel position="stacked" className='py-5 text-lg'>Body</IonLabel>
               <IonInput ref={(ref) => setInputBody(ref)}
                type="text"
                placeholder="how are you?"
              />
               </IonItem>
               <IonItem>
              <IonLabel position="stacked" className='py-5 text-lg'>Attachments</IonLabel>
        
    <ul>
      {selectedFiles.map((file, index) => (
        <li key={index}>{file.name} 
         <button onClick={() => removeFile(index)} className='px-3 pt-2 col'><IonImg src="https://i.ibb.co/k1BVnnB/cross.png" className='w-8 h-8'></IonImg></button>
         </li>
        
      ))}

    </ul>
              <IonButton onClick={openModal} id="uploadButton">Upload Files</IonButton>
              <IonContent>
        <IonModal isOpen={showModal} onDidDismiss={closeModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Upload Files</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form encType='multipart/form-data'>
              <input
                type="file"
                name='file'
                ref={fileInputRef}
                accept="image/*, video/*"
                onChange={handleFileInputChange}
                multiple
              />
            </form>
            <IonButton onClick={closeModal}>Close Modal</IonButton>
          </IonContent>
        </IonModal>
        </IonContent>
            </IonItem>
          </IonContent>
        </IonModal>
        </IonItem>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
    <IonGrid className="email-grid">
  <IonRow className="header-row">
    <IonCol size="2" className="header-cell">Mail ID</IonCol>
    <IonCol size="2" className="header-cell">Date</IonCol>
    <IonCol size="4" className="header-cell">Subject</IonCol>
    <IonCol size="4" className="header-cell">Snippet</IonCol>
  </IonRow>

  {emailPages[currentPage - 1]?.map((email, index) => (
    <IonRow key={index} className="email-row">
      <IonCol size="2" className="email-cell">{email.mailId}</IonCol>
      <IonCol size="2" className="email-cell">{email.date}</IonCol>
      <IonCol size="4" className="email-cell">{email.subject}</IonCol>
      <IonCol size="4" className="email-cell">{email.snippet}</IonCol>
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