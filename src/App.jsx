// App.js
import { useEffect, useState } from "react";
import { auth } from "./Admin/Firebase/firebaseConfig";
import "./app.css";
import Auth from "./Routes/Auth";
import Protected from "./Routes/Protected";
import LoadingOverlay from './Loading/Loading';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <>
    {console.log('user',user)}
      {user ? <Protected /> : <Auth />}
    </>
  );
}

export default App;
