'use strict';
var blocklist = [];
// ----------------- Internationalization ------------------
document.querySelectorAll('[data-i18n]').forEach(node => {
  let [text, attr] = node.dataset.i18n.split('|');
  text = chrome.i18n.getMessage(text);
  //debugger;
  attr ? node[attr] = text : node.appendChild(document.createTextNode(text));
});
// ----------------- /Internationalization -----------------

// ----- global
const accounts = document.querySelector('#accounts');
const medias = document.querySelector('#medias');
const popup = document.querySelector('.popup');
const textOptionsBlock =  document.querySelector('#textOptionsBlock');
const weekBlocked =  document.querySelector('#weekBlocked');
const popupMain = popup.children[0];

let storageArea, minIndex = Number.MAX_SAFE_INTEGER;
let savedCode = "";
// ----------------- User Preference -----------------------
chrome.storage.local.get(null, result => {
  storageArea =  chrome.storage.local;
  console.dir(result);
  result ?  processOptions(result) : processOptions(result);
  result ?  processMedia(result) : processMedia(result);

			if (typeof result.blockUntil != "undefined"){
				const currentT = Date.now();
				if (currentT < result.blockUntil){
					console.log("if");
					//textOptionsBlock.innerText="websites blocked until 7 days period elapsed.";
					textOptionsBlock.style.display="none";
					weekBlocked.style.display="block";
				}else{
					console.log("else");
					//textOptionsBlock.innerHTML="Block all for one week.	<div style=\"text-align: right;\"><button data-i18n=\"weekBlock\" id=\"weekBlock\" type=\"submit\">  </button>	</div>";					
				textOptionsBlock.style.display="block";
				weekBlocked.style.display="none";
				}
			}else{
				textOptionsBlock.style.display="block";
				weekBlocked.style.display="none";
			}
});

// ----------------- Spinner -------------------------------TO BE CHANGED
const spinner = document.querySelector('.spinner');
function hideSpinner() {
  spinner.classList.remove('on');
  setTimeout(() => { spinner.style.display = 'none'; }, 600);
}

function showSpinner() {
  spinner.style.display = 'flex';
  spinner.classList.add('on');
}
// ----------------- /spinner ------------------------------/TO BE CHANGED


// ----- add Listeners for menu
document.querySelectorAll('nav a').forEach(item => item.addEventListener('click', process));
function process() {
  switch (this.dataset.i18n) {
    case 'add':
      location.href = '/addWord.html';
      break;
  }
}



function processOptions(pref) {
  // --- reset
  accounts.textContent = '';
  // ----- templates & containers
  const docfrag = document.createDocumentFragment();
  const docfrag2 = document.createDocumentFragment();
  const temp = document.querySelector('.template');
console.dir(temp);
  // --- working directly with DB format
  const prefKeys = Object.keys(pref); // not for these
//console.dir(pref.censor);
 // pref.censor
		if(typeof pref.censor != "undefined"){
			  for(var i =0 ; i<pref.censor.length; i++){
				  var id=i;
				//	console.log("censored");
				//	console.dir(pref.censor[id]);
				const item = pref.censor[id];

				const div = temp.cloneNode(true);
				const node = [...div.children[0].children];//, ...div.children[1].children];
				div.classList.remove('template');
				div.id = id;
				//console.dir(node);
			  
				node[0].textContent = pref.censor[id]; // ellipsis is handled by CSS
				//console.dir(node[0].textContent);
				docfrag.appendChild(div);
				// add to select
				const opt = new Option(node[0].textContent, id);
				opt.style.color = "";
				docfrag2.appendChild(opt);
			 }
		}

  docfrag.hasChildNodes() && accounts.appendChild(docfrag);
  // add Listeners
  document.querySelectorAll('button').forEach(item => item.addEventListener('click', processButton));

  doWeHaveKeyWordsDefined();
  hideSpinner();
}
function processMedia(pref) {

  chrome.storage.local.get(null, result => {
	  
			if (typeof result.blockUntil != "undefined"){
				const currentT = Date.now();
					console.log("current"+currentT);
					console.log(result.blockUntil);
				if (currentT < result.blockUntil){
					console.log("keyWords_weekblock");

					//media button display none show blocked.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				  // --- reset
				  medias.textContent = '';
				  // ----- templates & containers
				  const docfrag = document.createDocumentFragment();
				  const docfrag2 = document.createDocumentFragment();
				  const temp = document.querySelector('.templateMediaWeek');
				console.dir(temp);
				  // --- working directly with DB format
				  const prefKeys = Object.keys(pref); // not for these
				console.dir(pref.censorMedia);

				  for(var i =0 ; i<pref.censorMedia.length; i++){
					  var id=i;
						//console.log("censored");
					//	console.dir(pref.censorMedia[id]);
					const item = pref.censorMedia[id];

					const div = temp.cloneNode(true);
					const node = [...div.children[0].children];//, ...div.children[1].children];
					div.classList.remove('templateMediaWeek');
					div.id = id;
					//console.dir(node);
				  
					node[0].textContent = pref.censorMedia[id]; // ellipsis is handled by CSS
					//console.dir(node[0].textContent);
					docfrag.appendChild(div);
					// add to select
					const opt = new Option(node[0].textContent, id);
					opt.style.color = "";
					docfrag2.appendChild(opt);
				 }

				  docfrag.hasChildNodes() && medias.appendChild(docfrag);
				  // add Listeners
				  document.querySelectorAll('button').forEach(item => item.addEventListener('click', processButton));

				  doWeHaveMediaDefined();
				  hideSpinner();
  
				}else{
						//do nothing
					  // --- reset
					  medias.textContent = '';
					  // ----- templates & containers
					  const docfrag = document.createDocumentFragment();
					  const docfrag2 = document.createDocumentFragment();
					  const temp = document.querySelector('.templateMedia');
					console.dir(temp);
					  // --- working directly with DB format
					  const prefKeys = Object.keys(pref); // not for these
					console.dir(pref.censorMedia);

					  for(var i =0 ; i<pref.censorMedia.length; i++){
						  var id=i;
							//console.log("censored");
						//	console.dir(pref.censorMedia[id]);
						const item = pref.censorMedia[id];

						const div = temp.cloneNode(true);
						const node = [...div.children[0].children];//, ...div.children[1].children];
						div.classList.remove('templateMedia');
						div.id = id;
			//			console.dir(node);
					  
						node[0].textContent = pref.censorMedia[id]; // ellipsis is handled by CSS
			//			console.dir(node[0].textContent);
						docfrag.appendChild(div);
						// add to select
						const opt = new Option(node[0].textContent, id);
						opt.style.color = "";
						docfrag2.appendChild(opt);
					 }

					  docfrag.hasChildNodes() && medias.appendChild(docfrag);
					  // add Listeners
					  document.querySelectorAll('button').forEach(item => item.addEventListener('click', processButton));

					  doWeHaveMediaDefined();
					  hideSpinner();
  						
				}		
			}else{
									//do nothing
				  // --- reset
				  medias.textContent = '';
				  // ----- templates & containers
				  const docfrag = document.createDocumentFragment();
				  const docfrag2 = document.createDocumentFragment();
				  const temp = document.querySelector('.templateMedia');
				console.dir(temp);
				  // --- working directly with DB format
				  const prefKeys = Object.keys(pref); // not for these
				console.dir(pref.censorMedia);
				if(typeof pref.censorMedia != "undefined"){
					  for(var i =0 ; i<pref.censorMedia.length; i++){
						  var id=i;
							console.log("censored");
							console.dir(pref.censorMedia[id]);
						const item = pref.censorMedia[id];
						const div = temp.cloneNode(true);
						const node = [...div.children[0].children];//, ...div.children[1].children];
						div.classList.remove('templateMedia');
						div.id = id;
						console.dir(node);
					  
						node[0].textContent = pref.censorMedia[id]; // ellipsis is handled by CSS
						console.dir(node[0].textContent);
						docfrag.appendChild(div);
						// add to select
						const opt = new Option(node[0].textContent, id);
						opt.style.color = "";
						docfrag2.appendChild(opt);
					}
				}

				  docfrag.hasChildNodes() && medias.appendChild(docfrag);
				  // add Listeners
				  document.querySelectorAll('button').forEach(item => item.addEventListener('click', processButton));

				  doWeHaveMediaDefined();
				  hideSpinner();
									
			}   
  }  );
}

function doWeHaveKeyWordsDefined() {

  if (!accounts.hasChildNodes()) {
	  	console.log("doWeHaveKeyWordsDefined");
    document.querySelector('#help').style.display = 'block';
    //document.querySelector('#rightColumn').classList.add('secondary');
    //document.querySelector('#mode').style.display = 'none';
  }
  else {
    document.querySelector('#help').style.display = 'none';
    document.querySelector('#rightColumn').classList.remove('warning');
    //document.querySelector('#mode').style.display = 'flex';
  }
}

function doWeHaveMediaDefined() {
	
  if (!medias.hasChildNodes()) {
	  console.log("doWeHaveMediaDefined");
    document.querySelector('#helpMedia').style.display = 'block';
    document.querySelector('#rightColumnMedia').classList.add('secondary');
    //document.querySelector('#mode').style.display = 'none';
  }
  else {
    document.querySelector('#helpMedia').style.display = 'none';
    document.querySelector('#rightColumnMedia').classList.remove('warning');
    //document.querySelector('#mode').style.display = 'flex';
  }
}

function removeCensorElt(index){
	
	chrome.storage.local.get(null, result => {
		var censorArr = 	result.censor ;
		censorArr.splice(index,1);
		 storageArea.set({["censor"]: censorArr}, () => {   console.log("deleted");  });
});
}

function removeMediaElt(index){
	chrome.storage.local.get(null, result => {
		var censorArr = 	result.censorMedia ;
		censorArr.splice(index,1);
		 storageArea.set({["censorMedia"]: censorArr}, () => {   console.log("deleted");  });
	});
}

function processButton() {

  const parent = this.parentNode.parentNode;
  const id = parent.id;

  switch (this.dataset.i18n) {

    case 'help|title':
      //popupMain.children[0].textContent = chrome.i18n.getMessage('syncSettings');
      popupMain.children[1].textContent = chrome.i18n.getMessage('syncSettingsHelp');
      popupMain.children[2].children[0].style.visibility = 'hidden';
      popupMain.children[2].children[1].addEventListener('click', closePopup);
      showPopup();
      break;

    case 'delete|title':   
        parent.style.opacity = 0;
        setTimeout(() => { parent.remove(); doWeHaveKeyWordsDefined();}, 600);          // remove row
        removeCensorElt(id);
		console.log("keyword"+id);
		storageArea.remove(id);
		 location.href = '/keyWords.html' 
      break;
	  
	case 'deleteMedia':
  
        parent.style.opacity = 0;
        setTimeout(() => { parent.remove(); doWeHaveKeyWordsDefined();}, 600);          // remove row
        removeMediaElt(id);
				console.log("media" +id);
		storageArea.remove(id);
		 location.href = '/keyWords.html' 
     
      break;

    case 'up|title':
    case 'down|title':
      const target = this.dataset.i18n === 'up|title' ? parent.previousElementSibling : parent.nextElementSibling;
      const insert = this.dataset.i18n === 'up|title' ? target : target.nextElementSibling;
      parent.parentNode.insertBefore(parent, insert);
      parent.classList.add('on');
      setTimeout(() => { parent.classList.remove('on'); }, 600);
      storageArea.get(null, result => {
        // re-index
        //[...accounts.children].forEach((item, index) => item.id !== LASTRESORT && (result[item.id].index = index));
        [...accounts.children].forEach((item, index) => {if(item.id!="password"&&item.id!="accountId"&&item.id!="deviceId"&&item.id!="mode"){result[item.id].index = index; console.dir(item.id);}});
        minIndex = 0; // minimum index is always 0 now
        storageArea.set(result);
      });
      break;
  }
}

function showPopup() {

  popup.style.display = 'flex';
  window.getComputedStyle(popup).opacity;
  window.getComputedStyle(popup.children[0]).transform;
  popup.classList.add('on');
}

function closePopup() {

  popup.classList.remove('on');
  setTimeout(() => {
    popup.style.display = 'none';
    // reset
    popupMain.children[0].textContent = '';
    popupMain.children[1].textContent = '';
    popupMain.children[2].children[0].style.visibility = 'visible';
    popupMain.replaceChild(popupMain.children[2].cloneNode(true), popupMain.children[2]); // cloning to remove listeners
  }, 600);
}

