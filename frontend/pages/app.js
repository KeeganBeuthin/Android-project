import MyApp from "./_app";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withIonRouter } from '@ionic/react-router';
import { setupIonicReact } from '@ionic/react';

const oidcConfig = {
    authority: "http://localhost:4000",
    client_id: "client",
    client_secret: '8535thldsfjgh09p34yoisvldfsgbljr',
    redirect_uri: "http://localhost:3000",
    
  };

  export default function App() {
    const auth = useAuth()
 
      if (!auth.isAuthenticated) {
        router.push('/login'); 
      }
    

    return(
        <AuthProvider {...oidcConfig}>
            <App/>
        </AuthProvider>
    )


  }