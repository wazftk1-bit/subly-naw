import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { auth } from "./firebase.js";

export async function loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        return {
            success: true,
            user: result.user
        };

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message
        };
    }
}