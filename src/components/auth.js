import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";

const Auth = () => {
  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="text-center py-6">
      <button onClick={signIn} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
        Sign in with Google
      </button>
    </div>
  );
};

export default Auth;
