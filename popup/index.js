const apiinput = "<input type = 'text' id = 'APIinp'></input>"
		+"<button id = 'submitAPI'>Submit</button>";
var hasapi = 0;

function getAPIKey(){
	return(document.querySelector("#APIinp").value);
}

function setAPIKey(key){
	browser.storage.sync.set({geminiAPIkey: key});
}

browser.storage.sync.get(["geminiAPIkey"],(result) => {
	if(!result.geminiAPIkey){
		hasapi = 0;
		document.body.innerHTML += "<p id = 'noti'>No API key exists. Please enter API Key<a href = 'https://aistudio.google.com/api-keys'> from here.</a></p>"+apiinput;
		document.querySelector("#submitAPI").addEventListener("click", function (){			
			setAPIKey(getAPIKey());
			location.reload();
		});
	}
	else{
		document.body.innerHTML += "<p id = 'noti'>API key exists in memory! Edit existing API Key?</p>"
								+"<button id = 'APIedit'>Edit</button>";
		document.querySelector("#APIedit").addEventListener("click", function(){
			document.querySelector("#APIedit").style.display = "none";
			document.querySelector("#noti").innerHTML = "<p>Enter the new API key</p>"+apiinput;
			document.querySelector("#submitAPI").addEventListener("click", function (){
				setAPIKey(getAPIKey());
				document.querySelector("#APIinp").style.display = "none";
				document.querySelector("#submitAPI").style.display = "none";
				document.querySelector('#noti').innerHTML = "<p>API key has been modified successfully!</p>";
			});
			hasapi = 1;
		});
	}
});
