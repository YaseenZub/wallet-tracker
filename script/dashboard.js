
var uid = null;
var firestore=firebase.firestore();
var auth=firebase.auth();
console.log(firestore);
var nameDiv=document.querySelector('.name h2');
var signOut=document.querySelector('.signoutBtn');
var transactionForm=document.querySelector('.transactionForm');
var transactionList=document.querySelector('.transactionsList')
var userSignout = async()=>{
    await auth.signOut();
}
var fetchUser=async (uid)=>{
    try {
        var userInfo=await firestore.collection("users").doc(uid).get();
        return userInfo.data();

    } catch (error) {
        console.log(error);   
    }
}

var transactionFormSubmission = async   (e)=>{
    e.preventDefault();
        try {
            var title=document.querySelector(".title").value;
            var cost=document.querySelector(".cost").value;
            var transactionType=document.querySelector(".transactionType").value;
            var transactionAt=document.querySelector(".transactionAt").value;
            if(title && cost && transactionType && transactionAt){
                var transactionObject={
                    title,
                    cost,
                    transactionType,
                    transactionAt: new Date(transactionAt),
                    transactionBy: uid
                }
                await firestore.collection("transactions").add(transactionObject);
                var transactions=await fetchTransactions(uid);
                renderTransactions(transactions);
        } 
    }
        catch (error) {
            console.log(error);
        }
    }
var fetchTransactions=async (uid)=>{
    var transactions=[];
    var query = await firestore.collection("transactions").where("transactionBy","==",uid).orderBy("transactionAt","desc").get();
    query.forEach((doc)=>{
        transactions.push({...doc.data(),transactionId: doc.id});
    })
    return transactions;    
}

var renderTransactions= (transactionArr)=>{
    transactionList.innerHTML="";
    transactionArr.forEach((transaction,index)=>{
        var {title,cost,transactionAt,transactionId}=transaction;
        transactionList.insertAdjacentHTML('beforeend',`
        <div class="transactionListItem">
        <div class="renderIndex listItem">
            <h3>${++index}</h3>
        </div>
        <div class="renderTitle listItem">
            <h3>${title}</h3>
        </div>
        <div class="renderCost listItem">
            <h3>${cost}</h3>
        </div>
        <div class="renderTransactionAt listItem">
            <h3>${transactionAt.toDate().toISOString().split("T")[0]}</h3>
        </div>
        <div class="renderTransactionAt listItem">
            <a href="./transaction.html#${transactionId}"><button type="button">view</button></a>
        </div>
    </div>`
    )
    })
}



auth.onAuthStateChanged(async(user)=>{
    if(user){
        uid=user.uid;
        var userInfo= await fetchUser(uid);
        nameDiv.textContent=userInfo.fullName;
        var transactions=await fetchTransactions(uid);
        renderTransactions(transactions);
    }
    else{
        location.assign('./index.html');
    }
});

signOut.addEventListener("click",userSignout);

transactionForm.addEventListener("submit",(e)=> transactionFormSubmission(e))