// Import the functions you need from the SDKs you need
import { getAuth } from "@firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore, collection, getDocs,query,where, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { Alert } from "react-native";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHNz6VjJd7RhCWqz-QJWYgqWwtPlCQt6s",
  authDomain: "homeco-8262b.firebaseapp.com",
  projectId: "homeco-8262b",
  storageBucket: "homeco-8262b.appspot.com",
  messagingSenderId: "61370725143",
  appId: "1:61370725143:web:35df7ae9c1ef2b3872fd52"
};

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/Home',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};

// Initialize Firebase
let app;
if(!getApps.length){
    app = initializeApp(firebaseConfig);
} else {
    app = app()
}
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth();



const tempUserProfileImage = 'https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/avatar-512.png'
const tempHouseProfileImage = 'https://cdn3.iconfinder.com/data/icons/luchesa-vol-9/128/Home-512.png'

const tempHouseDescripton = 'Let\'s be the best house ever'


const capitalize = (text) => {
  if (text == '') return ''
  return text[0].toUpperCase() + text.substr(1).toLowerCase()
}

const capitalizeAll = (text) => {
  return text.split(' ').map(str => { return capitalize(str) }).join(' ')
}

function arrayRemove(arr, value) { 
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

const getByDocIdFromFirestore = async(collect, docId) =>{
  const docRef = doc(db,collect,docId)
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
  return docSnap.data()
}

const getCollectionFromFirestore = async(collect) =>{
  const collectCol = collection(db, collect);
  const collectSnapshot = await getDocs(collectCol);
  const collectList = collectSnapshot.docs.map(doc => doc.data());

  return collectList;
}

const getCollectionFromFirestoreByKeySubString = async(collect,substring) =>{
  if(substring == '')
    return [];
  const collectCol = collection(db, collect);
  const collectSnapshot = await getDocs(collectCol);
 
  const collectList = collectSnapshot.docs.filter(doc => { return String(doc.id).includes(substring) } ).map(doc => { return doc.data() });

  return collectList;
}

const getUCollectionFromFirestoreByUserNameSubString = async(collect,substring) =>{
  if(substring == '')
    return [];
  else{
    substring = capitalizeAll(substring)
    const collectCol = collection(db, collect);
    const collectSnapshot = await getDocs(collectCol);
  
    const collectList = collectSnapshot.docs.filter(doc => { return String(doc.data().fName + " " + doc.data().lName).includes(substring) } ).map(doc => { return doc.data() });
    
    return collectList;
  }
}

const getWhereFromFirestore = async(collect, col, term , value) => { // term can be - == ,<= ,>=, in (value is an array), array-contains-any (value is an array)... https://firebase.google.com/docs/firestore/query-data/queries// todo: fix return to return a llist
  const q = query(collection(db, collect), where(col, term, value))
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log("doc.id, doc.data()");

    console.log(doc.id, " => ", doc.data());
  });
  const collectList = querySnapshot.docs.map(doc => doc.data());
  return collectList
}

const deleteRowFromFirestore = async(collect, docId) => {
  await deleteDoc(doc(db,collect, docId))
}

const addUserToFirestore = async(email, fName, lName, phone, bDate, uImage ) => {
  await setDoc(doc(collection(db, 'users'), email), {
      fName: capitalize(fName),
      lName: capitalize(lName),
      phone: phone,
      bDate: bDate,
      email: email.replace(' ',''),
      uImage: uImage ? uImage : tempUserProfileImage
     });
    //  uploadImageToStorage('users',uImage ? uImage : tempUserProfileImage,email).then(alert()).catch()
}

const updateUserAtFirestore = async(userEmail, col, newValue) => {
  data[col] = newValue
  await setDoc(doc(db,"users", userEmail), {col: newValue } , {merge: true});
}

const setDefaultHousePartners = (partners) => {
  let partnersDict = {}
  let defPermitions = {"seeIncome": false, "seeMonthlyBills": false}


  for(let i in partners){
    partnersDict[partners[i]["email"]] = {
      user : partners[i],
      isAuth: false,
      nowIn : false,
      defPermitions : defPermitions, 
      incomeToCurHouse: 0, // {[ company, amount ]}
      outComeToCurHouse: {}, // {[ reasone, amount ]}
      allowance: {} // {[ from, amount ],...}
    }
    defPermitions = {"seeIncome": true, "seeMonthlyBills": true}
  }
  partnersDict[partners[0].email].isAuth = true
  partnersDict[partners[0].email].nowIn = true
  partnersDict[partners[0].email].defPermitions = defPermitions
  return partnersDict
}

const addHouseToFirestore = async(hName, cEmail, partners, hImage, description) => {
  let date = new Date()
  date = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes()
  partners = setDefaultHousePartners(partners)
  house = {
    hName: hName,
    cEmail: cEmail,
    partners: partners,
    cDate: date,
    hImage: hImage ? hImage : tempHouseProfileImage,
    description: description ? tempHouseDescripton : tempHouseDescripton
   }
  await setDoc(doc(collection(db, 'houses'), hName + "&" + cEmail),house );
  return house
}

const updateHouseAtFirestore = async(hName, col, newValue) => {
  const data = { }
  data[col] = newValue
  await setDoc(doc(db,"houses", hName), {col: newValue } , {merge: true});
}

const getHouseKeyByNameAndCreatorEmail = (hName, cEmail) => {
  return hName + "&" + cEmail
}

const getHousesByUserEmail = async(cEmail) => {
   return getCollectionFromFirestore("houses").then((collection) => {
    if(collection)
      return collection.filter((house) => { if(cEmail in house.partners) return house  })
    else
      return []
  }).catch(() => alert(e.massege))
}

export { auth, uiConfig ,tempHouseProfileImage, tempUserProfileImage,arrayRemove,capitalize ,capitalizeAll , getByDocIdFromFirestore, getCollectionFromFirestore, getWhereFromFirestore, deleteRowFromFirestore, addUserToFirestore, updateUserAtFirestore,
        setDefaultHousePartners ,addHouseToFirestore, updateHouseAtFirestore,getHousesByUserEmail, getHouseKeyByNameAndCreatorEmail, getCollectionFromFirestoreByKeySubString,getUCollectionFromFirestoreByUserNameSubString } 
