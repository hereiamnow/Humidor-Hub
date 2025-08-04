/**
 * auth_send_email_verification.js
 * 
 * Sends a verification email to the currently authenticated Firebase user.
 */

import { getAuth, sendEmailVerification } from "firebase/auth";

const auth = getAuth();
sendEmailVerification(auth.currentUser)
    .then(() => {
        // Email verification sent!
        // ...
    });
