import MyApp from "./pages/_app";
import * as React from "react";
import * as ReactDOM from "react-dom";

function MyApp() {
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

ReactDOM.render(
    <AuthProvider {...oidcConfig}>
        <MyApp/>
    </AuthProvider>,
    document.getElementById("root"),
);