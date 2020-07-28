var auth=firebase.auth();
var firestore=firebase.firestore(); 

var signInForm=document.querySelector(".signInForm");
var signUpForm=document.querySelector(".signUpForm");
var googleBtn=document.querySelector("#googleBtn");


var signInFormSubmission = async (e) =>{
    e.preventDefault();
    try{
    var email=document.querySelector("#signInEmailId").value;
    var password=document.querySelector("#signInPass").value;
    if(email && password)
        {
            var {user:{uid}} = await auth.signInWithEmailAndPassword(email,password);
            var userInfo = await firestore.collection('users').doc(uid).get();
            console.log(userInfo.data());
            location.assign(`./dashboard.html#${uid}`)
        }
       
    }
    catch(error){
        console.log(error);
    }
}

var signUpFormSubmission = async (e) =>{
    e.preventDefault();
    try {
        var fullName=document.querySelector("#signUpName").value;
        var email=document.querySelector("#signUpEmailId").value;
        var password=document.querySelector("#signUpPass").value;
        if(fullName && email && password)
        {
            var {user:{uid}} = await auth.createUserWithEmailAndPassword(email,password);
            console.log(uid);  
            var userInfo ={
                fullName,
                email,
                createdAt: new Date()
            }
            await firestore.collection("users").doc(uid).set(userInfo);
            console.log(userInfo);
            location.assign(`./dashboard.html#${uid}`)
        }
    } catch (error) {
        console.log(error);
    }
}
var googleSignIn = async ()=>{
    try {
        var googleProvider= new firebase.auth.GoogleAuthProvider();
        var {additionalUserInfo:{isNewUser},user:{displayName,uid,email}}= await firebase.auth().signInWithPopup(googleProvider);
        if(isNewUser){  
        var userInfo ={
            fullName: displayName,
            email,
            createdAt: new Date()
        }
        await firestore.collection("users").doc(uid).set(userInfo);
        console.log("done");
        location.assign(`./dashboard.html#${uid}`)
    }else{
        console.log("Welcome Back");
        location.assign(`./dashboard.html#${uid}`)
    }
        
    } catch (error) {
        console.log(error);
    }
}

auth.onAuthStateChanged(async(user)=>{
    if(user){
        uid=user.uid;
        location.assign(`./dashboard.html#${uid}`);
    }
    else{
        location.assign('./index.html');
    }
});

signInForm.addEventListener("submit",(e)=>signInFormSubmission(e));
signUpForm.addEventListener("submit",(e)=>signUpFormSubmission(e));
googleBtn.addEventListener("click",googleSignIn);