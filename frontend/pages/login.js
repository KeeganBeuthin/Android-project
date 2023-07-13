import { AuthProvider, useAuth } from "react-oidc-context";

const oidcConfig = {
    authority: "http://localhost:4000",
    client_id: "client",
    client_secret: '8535thldsfjgh09p34yoisvldfsgbljr',
    redirect_uri: "http://localhost:3000",
    
  };

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

  return <>
  <AuthProvider {...oidcConfig}>
  <App/>
  </AuthProvider>
  </>