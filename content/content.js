const MODEL = "gemini-2.0-flash";
var ansind = 0;
var rethink = 0;
var start = 0;
var end = 0;
var questionlen = 0;

function trunc(number){
	if (number < (parseInt(number)+0.1)){
		return (number);
	}
	
	else{
		return (parseInt(number)+1);

	}
}

browser.storage.sync.get(["geminiAPIkey"], ({geminiAPIkey}) => {
	if (!geminiAPIkey){
		console.log("NO API KEY IN STORAGE!!!");
		return;
	}
	const apikey = geminiAPIkey;
	main(apikey);
});

async function getresponse(prompts,start,questionlen, api){
	console.log("Wayform Started")
	const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api}`,
			{
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					contents: [{parts: [{text: prompts}]}]
				}),
			});

	if (!res.ok){
		const {error} = await res.json();
		setTimeout(getresponse, 60000, prompts, start, questionlen, api);		
		throw new Error(error?.message || "Request Failed");
	}
	const datas = await res.json();
	var answer = datas.candidates?.[0]?.content?.parts?.[0]?.text ?? "No Summary";
	var answers = answer.split("\t");
	//console.log(answers);

	var question = document.querySelectorAll("[role = 'listitem']");
	for (let i = start; i < questionlen; i++){
		//console.log(i);
		if (question[i].querySelectorAll("label").length > 0){
			
			for (let k = 0; k < question[i].querySelectorAll("label").length; k++){
				if (document.querySelectorAll("[role='listitem']")[i].querySelectorAll("label")[k].style.backgroundColor){
					document.querySelectorAll("[role='listitem']")[i].querySelectorAll("label")[k].style = "";
					break;
				}
			}
			
			for (let j = 0; j < question[i].querySelectorAll("label").length; j++){
				if (question[i].querySelectorAll("label")[j].innerText == answers[ansind]){
					ansind++;
					document.querySelectorAll("[role='listitem']")[i].querySelectorAll("label")[j].style = "background-color: rgba(90, 0, 255, 0.14);";
					
					break;
					
					
				}
				if(j == question[i].querySelectorAll("label").length-1){
					//console.log(answers[ansind]);
					ansind++;
					rethink = 1;
				}
			}
		}
	}
	if (rethink == 1){
		getresponse(prompts,start,questionlen, api);
		ansind = 0;
		rethink = 0;
	}
	ansind = 0;
}

function main(key){
	const apikey = key;
	var batch = 0;
	var fullquestion;
	var starton;
	var fullquestion;
	var question = document.querySelectorAll("[role = 'listitem']");
	for (let i = 0; i < question.length; i++){
		if (question[i].querySelectorAll("label").length > 0){
			questionlen++;

		}

	}
	end = questionlen/10;
	var batchcnt = trunc(end);
	
	for (let i = 0; i < (question.length+batchcnt); i++){
		if(i%batchcnt == 1){
			starton = i-batchcnt;
			getresponse(fullquestion+"\n\nSelect me the right options out of all these questions and return me the answers as a list seperated by tab spaces, anything after 'option <number>: ' is the full option and you should return me that option excluding the 'option <number>:' alone but make sure to include anything after that no matter what, don't think you are cool on including your own answers I need the exact answer that comes after the option because it will mark the answers only if both the existing element and your answer is same so please include anything that comes after 'option <number>: ', don't give me any explanations because your response will be added into code automatically. Please do not exclude anything after 'option <number>: ' while selecting the option. DO NOT EXCLUDE ANYTHING AFTER 'option <number>: ' for example:\n 'option 1: b) Rs 10,000' must be returned as 'b) 10,000'. I want the options to be returned AS IS and do not ignore any questions. \n REMEMBER! YOUR RESPONSE WILL BE DIRECTLY IMPORTED INTO SCRIPT SO DO NOT GIVE ANY ADDITIONAL TEXTS!!", starton, (starton+batchcnt), apikey);
			fullquestion = "";
		}
		
		if (question[i]){
			if(question[i].querySelectorAll("label").length > 0){
				fullquestion += `\nselect one out of ${question[i].querySelectorAll("label").length} options \n${question[i].querySelector("span").innerText}`;
				for (let j = 0; j < question[i].querySelectorAll("label").length; j++){
					fullquestion += `\nOption ${j+1}: ${question[i].querySelectorAll("label")[j].innerText}`;
				}
			}
		}
	}
}
