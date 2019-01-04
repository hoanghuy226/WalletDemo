import bip39 from 'bip39';
window.bip39 = bip39;
// import keythereum from 'keythereum';
// window.keythereum = keythereum;
import wallet from 'ethereumjs-wallet';
window.wallet = wallet;
import hdkey from 'ethereumjs-wallet/hdkey';
window.hdkey = hdkey;
import CryptoJS from 'crypto-js';
window.CryptoJS = CryptoJS;
import Web3 from 'web3';
import EthUtil from 'ethereumjs-util';

if (web3) {
    window.web3 = new Web3(web3.currentProvider);
} else {
    window.web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:7545"));
}
const $ = (selector, callback) => {
    document.querySelector(selector).addEventListener("click", (e) => {
        e.preventDefault();
        callback(e);
    }, false);
}

$("#createWeb3", async e => {
    let account = await web3.eth.accounts.create();
    alert("privateKey= "+ account.privateKey);
    alert("account= "+ account.address);
});

$("#createKeythereum", e => {
  // var params = { keyBytes: 32, ivBytes: 16 };
  // var dk = keythereum.create();
  // console.log(dk);
});

$("#createEJS", e => {
    var seed = bip39.generateMnemonic();
    var privateKey = hdkey.fromMasterSeed(seed)._hdkey._privateKey;
    var newW = wallet.fromPrivateKey(privateKey);
    alert("seed= "+ seed);
    alert("privateKey= "+ newW.getPrivateKeyString());
    alert("account= "+ newW.getAddressString());
    
    // var newW = wallet.generate();
    // alert("privateKey= "+ newW.getPrivateKeyString());
    // alert("account= "+ newW.getAddressString());
});

$("#importKeyWeb3", e => {
    console.log("importKeyWeb3");
    var privateKey = prompt("Enter your key : ", "");
    if(privateKey){
      console.log("input value: ",privateKey);
      var value = web3.eth.accounts.privateKeyToAccount(privateKey);
      alert("account= "+ value.address);
    }
});

$("#importKeyEJS", e => {
  console.log("importKeyEJS");
  var privateKey = prompt("Enter your key : ", "");
  if(privateKey){
    console.log("input value: ",privateKey);
    var privateKeyBuffer = EthUtil.toBuffer(privateKey);
    var newW = wallet.fromPrivateKey(privateKeyBuffer);
    // alert("privateKey= "+ newW.getPrivateKeyString());
    alert("account= "+ newW.getAddressString());
  }
});

$("#importSeed", e => {
    console.log("importSeed");
    var seed = prompt("Enter your seed : ", "");
    if(seed){
      console.log("input value: ",seed);
      var privateKey = hdkey.fromMasterSeed(seed)._hdkey._privateKey;
      var newW = wallet.fromPrivateKey(privateKey);
      alert("seed= "+ seed);
      alert("privateKey= "+ newW.getPrivateKeyString());
      alert("account= "+ newW.getAddressString());
    }
});

$("#saveWeb3", async e => {
    console.log("saveWeb3");
    let account = await web3.eth.accounts.create();
    console.log("privateKey= ",account.privateKey);
    console.log("account= ",account.address);
    localStorage.setItem("privateKey", account.privateKey);
    localStorage.setItem("account", account.address);
    alert("privateKey form localStorage= "+ localStorage.getItem('privateKey'));
    alert("account from localStorage=  "+ localStorage.getItem('account'));
});

$("#saveKeythereum", e => {
    alert("saveKeythereum");
});

$("#saveEJS", e => {
  console.log("saveEJS");
  var seed = bip39.generateMnemonic();
  var privateKey = hdkey.fromMasterSeed(seed)._hdkey._privateKey;
  var newW = wallet.fromPrivateKey(privateKey);
  // alert("seed= "+ seed);
  alert("privateKey= "+ newW.getPrivateKeyString());
  alert("account= "+ newW.getAddressString());
  var password = prompt("Enter your password : ", "");
  var jsonData;
  console.log("Doing......");
  if(password){
    jsonData = JSON.stringify(newW.toV3String(password));
  }else{
    jsonData = JSON.stringify(newW.toV3String("password"));
  }
  console.log(jsonData);
  download(jsonData, 'keystore.json', 'text/plain');
});
function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

$("#loadWeb3", e => {
  alert("privateKey form localStorage= "+ localStorage.getItem('privateKey'));
  alert("account from localStorage=  "+ localStorage.getItem('account'));
});

$("#loadKeythereum", e => {
    alert("loadKeythereum");
});

$("#loadEJS", e => {
  console.log("loadEJS");
  var password = prompt("Enter your password : ", "");
  console.log("Doing......");
  if(!password){
    alert("Must be input password!");
    return;
  };
  var files = document.getElementById('selectFiles').files;
  console.log(files);
  if (files.length <= 0) {
  return false;
  }

  var fr = new FileReader();

  fr.onload = function(e) { 
    console.log(e);
    var result = JSON.parse(e.target.result);
    var formatted = JSON.stringify(result, null, 2);
    console.log("json:",result);
    var newW =  wallet.fromV3(result,password,true);
    alert("privateKey= "+ newW.getPrivateKeyString());
    alert("account= "+ newW.getAddressString());
  }
  fr.readAsText(files.item(0));

});