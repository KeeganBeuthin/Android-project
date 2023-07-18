import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import { Router } from 'react-router'

import { setupIonicReact } from '@ionic/react';
import { useAuth,AuthProvider } from '../src';
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


const oidcConfig = {
  authority: "http://localhost:4000",
  client_id: "client",
  client_secret: '8535thldsfjgh09p34yoisvldfsgbljr',
  redirect_uri: "http://localhost:3000",
  
};

function Login() {
  const auth = useAuth();
console.log(useAuth())
 
  if (auth.error) {
      return <div>Oops... {auth.error.message}</div>;
  }

  if(!auth.isLoading){
    console.log('loading')
    return(<>
    <h1>...Loading</h1>
    </>)
  }
  if(!auth.isAuthenticated){
    console.log('hello')
    return(<>
    <h1>please Login</h1>
    <button className='blue-400' onClick={() => void auth.signinRedirect()}>Log in</button>
    </>)
  };

  if (auth.isAuthenticated) {
    console.log('authenticated')
      return (
          <div>
              <MyApp></MyApp>
              <button onClick={() => void auth.removeUser()}>
                  Log out
              </button>
          </div>
      );
  }
  console.log('here')
  return <button onClick={() => void auth.signinRedirect()}>Log in</button>
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




function Page(){
  return(
  <>
  <AuthProvider {...oidcConfig}>
<Login/>
</AuthProvider>
  </>
  )
}

export default Page