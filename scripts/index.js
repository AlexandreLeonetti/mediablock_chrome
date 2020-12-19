
document.querySelectorAll('button').forEach(item => item.addEventListener('click', saveCode));


function saveCode (){
	var mediaCode = 	document.getElementById("mediaCode");
	chrome.storage.local.set({"savedCode":mediaCode.value});
}







