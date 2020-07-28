var uid = null;
var firestore = firebase.firestore();
var auth = firebase.auth();
var transactionId = location.hash.substring(1, location.hash.length);
var transactionForm = document.querySelector(".transactionForm");
var transactionTitle = document.querySelector(".title");
var transactionCost = document.querySelector(".cost");
var transactionType = document.querySelector(".transactionType");
var transactionAt = document.querySelector(".transactionAt");
var deleteBtn = document.querySelector("#deleteBtn");

var fetchTransaction = async (transactionId) => {
  try {
    var transaction = await firestore
      .collection("transactions")
      .doc(transactionId)
      .get();
    return transaction.data();
  } catch (error) {
    console.log(error);
  }
};

var editFormHandler = async (e, transactionId) => {
  e.preventDefault();
  try {
    var updatedTitle = transactionTitle.value;
    var updatedCost = transactionCost.value;
    var updatedType = transactionType.value;
    var updatedDate = transactionAt.value;
    var updatedTransaction = {
      title: updatedTitle,
      cost: parseInt(updatedCost),
      transactionType: updatedType,
      transactionAt: new Date(updatedDate),
    };
    await firestore
      .collection("transactions")
      .doc(transactionId)
      .update(updatedTransaction);

    location.assign("./dashboard.html");
  } catch (error) {
    console.log(error);
  }
};

var deleteTransaction = async(e,transactionId)=>{
    e.preventDefault();
    try{
        await firestore.collection('transactions').doc(transactionId).delete();
        location.assign('./dashboard.html');
    }
    catch(error){
        console.log(error);
    }
};

auth.onAuthStateChanged(async (user) => {
  if (user) {
    uid = user.uid;
    var {
      title,
      cost,
      transactionType: type,
      transactionAt: dated,
    } = await fetchTransaction(transactionId);
    transactionTitle.value = title;
    transactionCost.value = cost;
    transactionType.value = type;
    transactionAt.value = dated.toDate().toISOString().split("T")[0];
  } else {
    location.assign("./index.html");
  }
});

transactionForm.addEventListener("submit", (e) =>
  editFormHandler(e, transactionId)
);

deleteBtn.addEventListener("click", (e) => deleteTransaction(e,transactionId));
