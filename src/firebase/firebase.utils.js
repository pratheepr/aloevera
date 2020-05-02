import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config =  {
    apiKey: "AIzaSyDOOIUR4oPHRFmXebSF1_RmM3-StyOs1vI",
    authDomain: "aloevera-ad152.firebaseapp.com",
    databaseURL: "https://aloevera-ad152.firebaseio.com",
    projectId: "aloevera-ad152",
    storageBucket: "aloevera-ad152.appspot.com",
    messagingSenderId: "684240811164",
    appId: "1:684240811164:web:191ed660f8cab77aa4a959",
    measurementId: "G-WY3YGQS161"
  };

  export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    console.log ('inside doc refr.');

    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get(); 
    console.log(snapShot); 

    if(!snapShot.exists) {
        const { displayName, email } = userAuth; 
        const createdAt = new Date(); 

        console.log ( displayName) ; 
        
        try {
           await userRef.set({
             displayName,
             email,
             createdAt,
             ...additionalData
           })
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }
    console.log ('outside doc refr.');

    return userRef; 



  }

  firebase.initializeApp(config);

  export const auth= firebase.auth();
  export const firestore = firebase.firestore(); 

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' }); 
  export const signInWithGoogle = () => auth.signInWithPopup(provider); 

  export default firebase; 

