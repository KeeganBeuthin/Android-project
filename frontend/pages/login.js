import { AuthProvider, useAuth } from "../src/.";
import App from "./app";


const oidcConfig = {
    authority: "http://localhost:4000",
    client_id: "client",
    client_secret: '8535thldsfjgh09p34yoisvldfsgbljr',
    redirect_uri: "http://localhost:3000",
    
  };

  export default function Login(){
  
  return <>
  <AuthProvider {...oidcConfig}>
  <App/>
  </AuthProvider>
  </>
  }