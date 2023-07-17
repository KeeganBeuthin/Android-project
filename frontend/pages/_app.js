import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import { withIonRouter } from '@ionic/react-router';
import { setupIonicReact } from '@ionic/react';
import { AuthProvider, useAuth } from "../src/.";
import 'tailwindcss/tailwind.css';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '../styles/global.css';
import '../styles/variables.css';




function App() {
  const auth = useAuth();

  if (auth.isLoading) {
      return <div>Loading...</div>;
  }

  if (auth.error) {
      return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
      return (
          <div>
              Hello {auth.user?.profile.sub}{" "}
              <button onClick={() => void auth.removeUser()}>
                  Log out
              </button>
          </div>
      );
  }

  return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
}



function MyApp({ Component, pageProps }) {
  


console.log(useAuth)

  return (
    
    <>
    
   
    
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        ></meta>
      </Head>
      <Component {...pageProps} />
      <Script
        type="module"
        src="https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.esm.js"
      ></Script>
      <Script nomodule="" src="https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.js"></Script>
     
     
    </>
  );
}

export default MyApp;
