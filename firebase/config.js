
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth,getReactNativePersistence} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
   apiKey: "AIzaSyDWjv5u8yTGKgJB1F1PuHv-_tennr3FGEk",
  authDomain: "task-f3dbe.firebaseapp.com",
  projectId: "task-f3dbe",
  storageBucket: "task-f3dbe.firebasestorage.app",
  messagingSenderId: "1009129073894",
  appId: "1:1009129073894:web:0031367b81c122fea49f27"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


export { auth ,db };
// export const auth = getAuth(app);
