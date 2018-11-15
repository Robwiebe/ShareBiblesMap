import firebase from "firebase";
import Credential from './firebase-key.json'

const app = firebase.initializeApp(Credential);

export default app;
