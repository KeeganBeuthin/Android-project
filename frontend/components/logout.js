import { useAuth } from "../src";


export default function Logout(){
    const auth=useAuth()
    return (
        
        <div>
            Hello {auth.user?.profile.sub}{" "}
            <button onClick={() => void auth.removeUser()}>
                Log out
            </button>
        </div>
    );
}