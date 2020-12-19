'use strict';

document.querySelectorAll('li, button, input').forEach(item => item.addEventListener('click', process));
		var cboxMedia = document.getElementById("cboxMedia");//value=true;
		var boxMedia = document.getElementById("boxMedia");//value=true;
		var mediaSwitch = document.getElementById("mediaSwitch");
		var sliderMed = document.getElementById("sliderMedia");
function processImagesBlocking(options){
	if(options==1){
		console.log("options"+options);
		var cboxImages = document.getElementById("cboxImages");//value=true;
			cboxImages.checked = true;
		console.dir(cboxImages);
	}else{
		var cboxImages = document.getElementById("cboxImages");//value=false;
			cboxImages.checked = false;
	}
}
function processKeywordBlocking(options){
	if(options==1){
		console.log("options"+options);
		var cboxKeywords = document.getElementById("cboxKeywords");//value=true;
			cboxKeywords.checked = true;
		console.dir(cboxKeywords);
	}else{
		var cboxKeywords = document.getElementById("cboxKeywords");//value=false;
			cboxKeywords.checked = false;
	}
}
function processCensorOptions(options){
	if(options==1){
		console.log("options"+options);
		var cboxMedia = document.getElementById("cboxMedia");//value=true;
			cboxMedia.checked = true;
		console.dir(cboxMedia);
	}else{
		var cboxMedia = document.getElementById("cboxMedia");//value=false;
			cboxMedia.checked = false;
	}
}

chrome.storage.local.get(null, result => {
	console.dir(result.isMediaBlocking);
			if(typeof result.isImagesBlocking != "undefined"){
				processImagesBlocking (result.isImagesBlocking);
				//alert("isImagesBlocking" +result.isImagesBlocking);
			}
			if(typeof result.isKeywordBlocking != "undefined"){
				processKeywordBlocking (result.isKeywordBlocking);
				//alert("isKeywordBlocking"+result.isKeywordBlocking);
			}
			if (typeof result.blockUntil != "undefined"){
				const currentT = Date.now();
				if (currentT < result.blockUntil){
					//media button display none show blocked.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					cboxMedia.style.display="none";	
					sliderMed.style.display="none";	
					mediaSwitch.innerText="Medias";					
					boxMedia.innerHTML="<strong> blocked </strong>";
				}else{
					if(typeof result.isMediaBlocking != "undefined"){
						processCensorOptions (result.isMediaBlocking);
					}					
				}			
			}else{
					if(typeof result.isMediaBlocking != "undefined"){
						processCensorOptions (result.isMediaBlocking);
					}				
			}
});


function process() {
  let tabs;
  switch (this.dataset.i18n) {
	case 'cboxImages':
		if(this.checked){	
			chrome.storage.local.set({"isImagesBlocking":1});
			chrome.runtime.sendMessage({"blockImages": "blockImages"});		
		}else{
			chrome.storage.local.set({"isImagesBlocking":0});
			chrome.runtime.sendMessage({"unblockImages": "unblockImages"});			
		}
    break;
	case 'cboxKeywords':
		if(this.checked){	
			chrome.storage.local.set({"isKeywordBlocking":1});
			chrome.runtime.sendMessage({"blockKeyword": "blockKeyword"});		
		}else{
			chrome.storage.local.set({"isKeywordBlocking":0});
			chrome.runtime.sendMessage({"unblockKeyword": "unblockKeyword"});			
		}
    break;
	case 'cboxMedia':
		if(this.checked){	
			chrome.storage.local.set({"isMediaBlocking":1});
			chrome.runtime.sendMessage({"blockMedia": "blockMedia"});		
		}else{
			chrome.storage.local.set({"isMediaBlocking":0});
			chrome.runtime.sendMessage({"unblockMedia": "unblockMedia"});			
		}
    break;


	case 'censor':
	 let urlKeywords = chrome.runtime.getURL('keyWords.html'); 
	  chrome.tabs.query({url:urlKeywords}, tabs => { // find a keyWords tab
        tabs[0] ? chrome.tabs.update(tabs[0].id, {active: true}) : chrome.tabs.create({url:urlKeywords}); // active existing tab OR open new tab
        window.close();
      });
      break;
    default:
  }
}
