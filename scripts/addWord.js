'use strict';

// ----------------- Internationalization ------------------
/*
document.querySelectorAll('[data-i18n]').forEach(node => {
  let [text, attr] = node.dataset.i18n.split('|');
  text = chrome.i18n.getMessage(text);
  attr ? node[attr] = text : node.appendChild(document.createTextNode(text));
});*/
// ----------------- /Internationalization -----------------

// ----- global

var MediaArray = [];
var keywordArray  = [];
var premium = false;
chrome.storage.local.get(null, result => {
		  if(typeof result.censor != "undefined" ){
			  keywordArray = result.censor ;
		  }
			if(typeof result.censorMedia != "undefined"){// result.censorMedia
				MediaArray = result.censorMedia;// result.censorMedia 
			}


});

let word = {};

const newKeyword =  document.querySelector('#wordAddress');
const newMedia =  document.querySelector('#mediaAddress');

// --- add Listeners
document.querySelectorAll('button').forEach(item => item.addEventListener('click', process));

function process() {
  switch (this.dataset.i18n) {
    case 'cancel':
       location.href = '/keyWords.html';
      break;
    case 'saveKeyword':
      if (!validateInput()) { return; }
      chrome.storage.local.set(makeword(), () => {
        location.href = '/keyWords.html' ;
      });
      break;
	 case 'saveMedia':
      if (!validateMedia()) { return; }
      chrome.storage.local.set(makeMedia(), () => {
        location.href = '/keyWords.html' ;
      });
      break;

	  case 'weekBlock':
	 console.log("clicked weekBlock");
      chrome.storage.local.set(blockForOneWeek(), () => {
        location.href = '/keyWords.html' ;
      });
      break;
	  case 'weekU':
	 console.log("clicked weekU");
      chrome.storage.local.set(Ublock(), () => {
        location.href = '/keyWords.html' ;
      });
      break;	  
  }
}


function validateInput() {
  document.querySelectorAll('input[type="text"]').forEach(item => item.value = item.value.trim());  
  newKeyword.value = Utils.stripBadChars(newKeyword.value);  
  newKeyword.classList.remove('invalid'); // reset
  if (!newKeyword.value) {
    newKeyword.classList.add('invalid');
    return false;
  }
  return true;
}

function blockForOneWeek() {
	const start = Date.now();
	//var blockUntilMS = 604800000+start;// one week 
	var blockUntilMS = 604800000+start;// 60000one min
	chrome.runtime.sendMessage({"blockMedia": "blockMedia"});	
	return {"blockUntil":blockUntilMS};
}
function Ublock() {
	const start = Date.now();
	var blockUntilMS = start;
	return {"blockUntil":blockUntilMS};
}

function validateMedia() {
  document.querySelectorAll('input[type="text"]').forEach(item => item.value = item.value.trim());  
  newMedia.value = Utils.stripBadChars(newMedia.value);  
  newMedia.classList.remove('invalid'); // reset
  if (!newMedia.value) {
    newMedia.classList.add('invalid');
    return false;
  }
  return true;
}

function makeword() {
   keywordArray.push(newKeyword.value);
  return {["censor"]: keywordArray};
}

function makeMedia() {
	var newMediaCompleted = newMedia.value;//"*://www."+ newMedia.value+"/*";
   MediaArray.push(newMediaCompleted);
  return {["censorMedia"]: MediaArray};//"censorMedia"
}

