import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDvIDdKCJ5giB1esuK2J9zaq8NqfspvikY",
  authDomain: "todo-85e4b.firebaseapp.com",
  projectId: "todo-85e4b",
  storageBucket: "todo-85e4b.appspot.com",
  messagingSenderId: "931938514310",
  appId: "1:931938514310:web:03fea5d881cbffc08a6807",
  measurementId: "G-3RJJBW1XGQ"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

  export default db;

