"use strict";

var reloader = 0;
var censorMedia = [];
var blocklist = [];
var tabBlockingMap = {};
var blocked = 0;
var savedCode = "";




const  requestChecker = request => {
		if(blocked ==1){
			  if (request && request.url) {
				if (request.type == "main_frame" ||request.type == "xmlhttprequest") {
				  var tabBlockingState = 0;
				  for (var i = 0; i < censorMedia.length; ++i) {
					if (request.url.match(new RegExp(  ".*" + censorMedia[i] + ".*" , "i"))) {
					  tabBlockingState = censorMedia[i];
					}
				  }
				  chrome.tabs.getSelected(null, function(tab) {
					tabBlockingMap[tab.id] = tabBlockingState;
				  });
				  if (tabBlockingState != 0) {
					var redirectUrl = chrome.extension.getURL("./pages/blocked.html");
					return { redirectUrl: redirectUrl };
				  }
				}
			  }
	}else if(blocked ==0){

	}

};


function updateMapping(details) {
		  if (typeof details.replacedTabId == "undefined") {
			if (!details.tabId in tabBlockingMap) {
			  tabBlockingMap[details.tabId] = 0;
			}
		  }
		  else {
			tabBlockingMap[details.tabId] = tabBlockingMap[details.replacedTabId];
			delete tabBlockingMap[details.replacedTabId];
		  }
}

chrome.webRequest.onBeforeRequest.addListener( requestChecker, {urls: ["*://*/*"]}, ["blocking"]);
chrome.webNavigation.onTabReplaced.addListener(updateMapping);
chrome.webNavigation.onCommitted.addListener(updateMapping);
					
					
function updateBlockMedia(message){
	if("blockMedia" in message){
		console.log("blocking");
		blocked =1;
	}else if("unblockMedia" in message){
		console.log("not blocking");
		blocked =0;
	}
}

chrome.runtime.onMessage.addListener(updateBlockMedia);
var PostData = (type, userData) => {

let BaseURL = 'https://www.mediablock-plugin.com/blockonomics/logNblock.php/';


    return new Promise((resolve, reject) =>{
            fetch(BaseURL+type, {
            method: 'POST',
            body: JSON.stringify(userData)
          })
          .then((response) => response.json())
          .then((res) => {

            console.log("response from Postdata "+JSON.stringify(res));
            //res = {"ok":"ok"}
            resolve(res);
          })
          .catch((error) => {
            console.log("error in promise "+error);
            console.log("type "+type);
            console.dir(userData);
            reject(error);
          });


      });
}
var getAllUrls = (code) => {
console.log("in globalThis.getAllUrls");
	if(code){
		let objToSend = {
			password:code
		};
		globalThis.PostData('login',objToSend).then((result) => {
			let responseJson = result;
			if(responseJson){
			   //  sessionStorage.setItem('userData',JSON.stringify(responseJson));
			   //  localStorage.setItem('userData',JSON.stringify(responseJson));
				console.dir(responseJson);
				for(var i=0;i<responseJson.length;i++){
					blocklist[i]=responseJson[i]["url"];
				}
				console.dir(blocklist);
				//UNICITY FILTER HERE.
				
				
				var CreateDBvsPageObj = (censorMedia) => {
					var baseNpage = {};
								for (var j in censorMedia) {               //
									baseNpage[censorMedia[j]] = censorMedia[j];   // EMAIL vs local dataBASE {}
								}
					return baseNpage ;
				}

				
			var	baseNpage = CreateDBvsPageObj (censorMedia);
			var LoopMailSender = (blocklist, baseNpage, censorMedia ) => {
							console.log("entered mail sender");
							for (var i in blocklist){																// LOOP through EMAILS		
								if (typeof baseNpage[blocklist[i]] != 'undefined'){								// IF known already, then get IGNORED
											console.log("Email already known, cant spam this adress");
								}else{
											 censorMedia.push(blocklist[i]); // to be CHANGED !
								}
							}
				}
				
				LoopMailSender (blocklist, baseNpage, censorMedia );
				//UNICITY FILTER end HERE.

			chrome.storage.local.set({"censorMedia":censorMedia});
	
       }else{
	       console.log(responseJson);
       }

      });
	}
}

chrome.storage.local.get(null, result => {
	console.dir(result);
			if(typeof result.censorMedia != "undefined"){
				censorMedia = result.censorMedia;
			}
			const currentT = Date.now();
			if (typeof result.blockUntil != "undefined"){
				if (currentT < result.blockUntil){
					blocked =1;			
				}else{//set blockuntil or blocked to zero ??? 
					if(typeof result.isMediaBlocking != "undefined"){
						blocked =result.isMediaBlocking;
					}					
				}			
			}else{
					if(typeof result.isMediaBlocking != "undefined"){
						blocked =result.isMediaBlocking;
					}				
			}
			if(typeof result.blocklist != "undefined"){//get blocklist from storage
				blocklist = result.blocklist;
				console.log(blocklist);
				//censorMedia = censorMedia.concat(blocklist);
			}
			if(typeof result.savedCode != "undefined"){
				if(typeof result.censorMedia != "undefined"){
					censorMedia = result.censorMedia;
				}
				savedCode =result.savedCode;
				console.log(savedCode);
				getAllUrls(savedCode);
			}
});

chrome.storage.onChanged.addListener(function(changes) {
	if(typeof changes != "undefined"){
			if(typeof changes.censorMedia != "undefined"){
				if(typeof changes.censorMedia.newValue != "undefined"){
					censorMedia = changes.censorMedia.newValue;
				}
			}
	}
});

let handler = undefined;
function updateBlocking(message){
		if("blockImages" in message){
						
							 console.log("blocking");
				const settings = {
					pattern: "<all_urls>",
					isBlocking: true,
					isReloadingOnToggle: false,

					ui: {
						windowDetails: {
							title: "Images are allowed",
						},
						icon: {
							path: "icons/image_allowed.svg",
						},
					},
				};
				 const blockingHandler = requestDetails => {
					return {
						cancel: settings.isBlocking
					};
				 };
				
				handler = blockingHandler;
				chrome.webRequest.onBeforeRequest.addListener(
					handler,
					{
						urls: [
							settings.pattern
						],
						types: [
							"image"
						]
					},
					[
						"blocking"
					]
				);	
				if(typeof chrome.tabs.reload() != "undefined"){
					chrome.tabs.reload().then(
								() => console.debug("Current page reloaded..."),
								e => console.error(e)
						);
				}
				
		}else if("unblockImages" in message){
			 console.log("try unblocking");
			if (handler) {
				chrome.webRequest.onBeforeRequest.removeListener(handler);
			}
			chrome.tabs.reload().then(
					() => console.debug("Current page reloaded..."),
					e => console.error(e)
			);
		}
}

chrome.runtime.onMessage.addListener(updateBlocking);