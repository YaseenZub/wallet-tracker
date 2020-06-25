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

    }else{
        console.log("Welcome Back");
    }
        
    } catch (error) {
        console.log(error);
    }
}

signInForm.addEventListener("submit",(e)=>signInFormSubmission(e));
signUpForm.addEventListener("submit",(e)=>signUpFormSubmission(e));
googleBtn.addEventListener("click",googleSignIn);