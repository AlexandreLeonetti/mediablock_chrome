
globalThis.getAllUrls = (code) => {
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

globalThis.PostData = (type, userData) => {

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





