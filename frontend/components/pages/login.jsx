
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
  } from '@ionic/react';
  import Logout from '../logout';
  import { AuthProvider } from '../../src';
const Login =()=>{

    return(
        <>
 
         <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
        <Logout/>
      </IonHeader>
      
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
    
          <IonToolbar>
            
            <IonTitle size="large">Lists</IonTitle>
          </IonToolbar>
          
        </IonHeader>
        <IonList>
          
        </IonList>
      </IonContent>
    </IonPage>
</>
)}

export default Login