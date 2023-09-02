import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAqPXsBK9be8Tvpi2ObEAf_OzHW6asbn_k",
  authDomain: "webcars-cff2b.firebaseapp.com",
  projectId: "webcars-cff2b",
  storageBucket: "webcars-cff2b.appspot.com",
  messagingSenderId: "983085944133",
  appId: "1:983085944133:web:9f649fa8b6ab815047c22c"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {db, auth, storage};