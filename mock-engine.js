// ================= GLOBAL STATE =================
let current = 0;
let score = 0;
let userAns = [];
let timer;
let timeLeft = 30;

// questions from CDN file
// expected format: window.questions OR global variable
let questions = window.questions || indusValleyQuestions || [];

// fallback safety
if(!questions.length){
questions = [
{q:"No Question Loaded", options:["A","B","C","D"], answer:0}
];
}

// limit to 25
questions = questions.slice(0,25);

// init user answers
userAns = new Array(questions.length).fill(null);

// ================= START TEST =================
function startTest(){
function startTest(){

const elem = document.documentElement;

if (elem.requestFullscreen) {
    elem.requestFullscreen();
} else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
} else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
}

document.getElementById("startBox").classList.add("hide");
document.getElementById("testBox").classList.remove("hide");

loadQ();
startTimer();
}

document.getElementById("startBox").classList.add("hide");
document.getElementById("testBox").classList.remove("hide");

loadQ();
startTimer();
}

// ================= LOAD QUESTION =================
function loadQ(){
let q = questions[current];

document.getElementById("question").innerText =
(current+1)+". "+q.question;

let html = "";

q.options.forEach((opt,i)=>{
let cls="option";

if(userAns[current] !== null){
if(i === q.answer) cls+=" correct";
else if(i === userAns[current]) cls+=" wrong";
}

html += `<div class="${cls}" onclick="selectAns(${i})">${opt}</div>`;
});

document.getElementById("options").innerHTML = html;
document.getElementById("score").innerText = score;

timeLeft = 30;
document.getElementById("timer").innerText = timeLeft;
}

// ================= ANSWER =================
function selectAns(i){

if(userAns[current] !== null) return;

userAns[current] = i;

if(i === questions[current].answer){
score += 1;
}else{
score -= 0.25;
}

loadQ();
}

// ================= TIMER =================
function startTimer(){
clearInterval(timer);

timer = setInterval(()=>{
timeLeft--;
document.getElementById("timer").innerText = timeLeft;

if(timeLeft <= 0){
nextQ();
}
},1000);
}

// ================= NAV =================
function nextQ(){
if(current < questions.length-1){
current++;
loadQ();
startTimer();
}
}

function prevQ(){
if(current > 0){
current--;
loadQ();
startTimer();
}
}

// ================= SUBMIT =================
if(document.fullscreenElement){
   document.exitFullscreen();
}
function submitTest(){
clearInterval(timer);

let correct=0, wrong=0, not=0;

questions.forEach((q,i)=>{
if(userAns[i] === null) not++;
else if(userAns[i] === q.answer) correct++;
else wrong++;
});

document.getElementById("testBox").classList.add("hide");
document.getElementById("resultBox").classList.remove("hide");

document.getElementById("finalScore").innerText =
"Final Score: " + score;

// chart
new Chart(document.getElementById("chart"),{
type:"pie",
data:{
labels:["Correct","Wrong","Not Attempted"],
datasets:[{
data:[correct,wrong,not]
}]
}
});

// analysis
let html = "<h3>Analysis</h3><ul>";

questions.forEach((q,i)=>{
html += "<li>"+(i+1)+". "+q.question+" - ";

if(userAns[i] === null) html+="Not Attempted";
else if(userAns[i] === q.answer) html+="Correct";
else html+="Wrong";

html += "</li>";
});

html += "</ul>";

document.getElementById("analysis").innerHTML = html;
}

// ================= EXIT =================
function exitTest(){

if(document.fullscreenElement){
   document.exitFullscreen();
}

if(confirm("Exit test?")){
   location.reload();
}

}

// ================= PDF =================
function downloadPDF(){
html2canvas(document.getElementById("resultBox")).then(canvas=>{
let img = canvas.toDataURL("image/png");
const { jsPDF } = window.jspdf;

let pdf = new jsPDF();
pdf.addImage(img,"PNG",10,10,180,160);
pdf.save("mock-result.pdf");
});
}
