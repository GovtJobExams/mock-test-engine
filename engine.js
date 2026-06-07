```javascript
// ================= GLOBAL STATE =================
let current = 0;
let score = 0;
let userAns = [];
let timer;
let timeLeft = 30;

let questions = window.questions || [];

if(!questions.length){
questions = [
{
q:"No Question Loaded",
options:["A","B","C","D"],
answer:0
}
];
}

questions = questions.slice(0,25);

userAns = new Array(questions.length).fill(null);

// ================= START TEST =================
function startTest(){

document.getElementById("startBox").classList.add("hide");
document.getElementById("testBox").classList.remove("hide");

const elem = document.getElementById("testBox");

if(elem.requestFullscreen){
elem.requestFullscreen();
}

loadQ();
startTimer();
}

// ================= LOAD QUESTION =================
function loadQ(){

let q = questions[current];

document.getElementById("question").innerText =
(current+1)+". "+q.q;

let html="";

q.options.forEach((opt,i)=>{

let cls="option";

if(userAns[current]!==null){

if(i===q.answer){
cls+=" correct";
}
else if(i===userAns[current]){
cls+=" wrong";
}

}

html += `
<div class="${cls}" onclick="selectAns(${i})">
${opt}
</div>
`;

});

document.getElementById("options").innerHTML = html;

document.getElementById("score").innerText =
score.toFixed(2);

document.getElementById("timer").innerText =
timeLeft;

if(document.getElementById("progressBar")){
document.getElementById("progressBar").style.width =
((current+1)/questions.length*100)+"%";
}

}

// ================= ANSWER =================
function selectAns(i){

if(userAns[current]!==null) return;

userAns[current]=i;

if(i===questions[current].answer){
score += 1;
}
else{
score -= 0.25;
}

loadQ();

}

// ================= TIMER =================
function startTimer(){

clearInterval(timer);

timer = setInterval(()=>{

timeLeft--;

document.getElementById("timer").innerText =
timeLeft;

if(timeLeft<=0){

nextQ();

}

},1000);

}

// ================= NEXT =================
function nextQ(){

if(current<questions.length-1){

current++;
timeLeft=30;

loadQ();

}
else{

submitTest();

}

}

// ================= PREVIOUS =================
function prevQ(){

if(current>0){

current--;
timeLeft=30;

loadQ();

}

}

// ================= SUBMIT =================
function submitTest(){

clearInterval(timer);

if(document.fullscreenElement){
document.exitFullscreen();
}

let correct=0;
let wrong=0;
let notAttempted=0;

questions.forEach((q,i)=>{

if(userAns[i]===null){

notAttempted++;

}
else if(userAns[i]===q.answer){

correct++;

}
else{

wrong++;

}

});

document.getElementById("testBox")
.classList.add("hide");

document.getElementById("resultBox")
.classList.remove("hide");

document.getElementById("finalScore")
.innerText =
"Final Score : "+score.toFixed(2);

// Chart
new Chart(document.getElementById("chart"),{
type:"pie",
data:{
labels:[
"Correct",
"Wrong",
"Not Attempted"
],
datasets:[{
data:[
correct,
wrong,
notAttempted
]
}]
}
});

// Analysis
let html="<h3>Detailed Analysis</h3>";

questions.forEach((q,i)=>{

let status="Not Attempted";

if(userAns[i]!==null){

status =
(userAns[i]===q.answer)
?
"✅ Correct"
:
"❌ Wrong";

}

html += `
<div style="
border:1px solid #ddd;
padding:10px;
margin:10px 0;
border-radius:8px;">
<b>Q${i+1}. ${q.q}</b><br><br>

Your Answer :
${
userAns[i]===null
?
"Not Attempted"
:
q.options[userAns[i]]
}
<br>

Correct Answer :
${q.options[q.answer]}
<br><br>

${status}
</div>
`;

});

document.getElementById("analysis")
.innerHTML = html;

}

// ================= EXIT =================
function exitTest(){

if(document.fullscreenElement){
document.exitFullscreen();
}

if(confirm("Exit Test?")){
location.reload();
}

}

// ================= PDF =================
function downloadPDF(){

html2canvas(
document.getElementById("resultBox")
).then(canvas=>{

let img =
canvas.toDataURL("image/png");

const { jsPDF } = window.jspdf;

let pdf = new jsPDF();

pdf.addImage(
img,
"PNG",
10,
10,
180,
160
);

pdf.save("mock-result.pdf");

});

}
```
