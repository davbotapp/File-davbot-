// ============================
// KOSHIBAR TUNNEL APP.JS
// ============================

// ---------- MENU ----------

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

if(menuBtn){

menuBtn.addEventListener("click",()=>{

sidebar.classList.add("active");
overlay.classList.add("active");

});

}

if(overlay){

overlay.addEventListener("click",()=>{

sidebar.classList.remove("active");
overlay.classList.remove("active");

});

}

// ---------- DASHBOARD ----------

const vpnSwitch = document.getElementById("vpnSwitch");
const statusText = document.getElementById("status");
const stateText = document.getElementById("state");
const logs = document.getElementById("logs");
const timerText = document.getElementById("timer");
const modeText = document.getElementById("mode");

const downloadText = document.getElementById("download");
const uploadText = document.getElementById("upload");

const protocolText = document.getElementById("protocol");
const serverStatus = document.getElementById("serverStatus");

let uptime = 0;
let timer = null;
let trafficInterval = null;

// =======================
// FORMAT DATA (KB / MB / GB)
// =======================

let totalDown = 0;
let totalUp = 0;

function formatBytes(kb){

if(kb < 1024){
return kb.toFixed(2) + " KB";
}

let mb = kb / 1024;

if(mb < 1024){
return mb.toFixed(2) + " MB";
}

let gb = mb / 1024;

return gb.toFixed(2) + " GB";

}

// =======================
// LOGS
// =======================

function addLog(message){

if(!logs) return;

const now =
new Date().toLocaleTimeString();

logs.innerHTML += `
<div class="log">
[${now}] ${message}
</div>
`;

logs.scrollTop =
logs.scrollHeight;

}

// =======================
// TRAFFIC (REALISTIC)
// =======================

function startTraffic(){

if(trafficInterval) return;

trafficInterval = setInterval(()=>{

// génération réaliste (KB/s)
let down = Math.random() * 900 + 50;
let up = Math.random() * 500 + 10;

// accumulation
totalDown += down / 10;
totalUp += up / 10;

// affichage live speed
if(downloadText){
downloadText.innerHTML =
"⬇ " + (down.toFixed(0)) + " KB/s";
}

if(uploadText){
uploadText.innerHTML =
"⬆ " + (up.toFixed(0)) + " KB/s";
}

// affichage total (si tu veux ajouter un petit display)
if(serverStatus){
serverStatus.innerHTML =
"↓ " + formatBytes(totalDown) +
" | ↑ " + formatBytes(totalUp);
}

},1000);

}

function stopTraffic(){

clearInterval(trafficInterval);
trafficInterval = null;

totalDown = 0;
totalUp = 0;

if(downloadText){
downloadText.innerHTML = "⬇ 0 KB/s";
}

if(uploadText){
uploadText.innerHTML = "⬆ 0 KB/s";
}

if(serverStatus){
serverStatus.innerHTML = "Offline";
}

}
// ---------- TIMER ----------

function startTimer(){

if(timer) return;

timer = setInterval(()=>{

uptime++;

const h =
String(Math.floor(uptime/3600))
.padStart(2,"0");

const m =
String(Math.floor(
(uptime%3600)/60
))
.padStart(2,"0");

const s =
String(uptime%60)
.padStart(2,"0");

if(timerText){

timerText.innerHTML =
`${h}:${m}:${s}`;

}

},1000);

}

function stopTimer(){

clearInterval(timer);

timer = null;

uptime = 0;

if(timerText){

timerText.innerHTML =
"00:00:00";

}

}

// ---------- TRAFIC ----------

function startTraffic(){

if(trafficInterval) return;

trafficInterval = setInterval(()=>{

const down =
(Math.random()*800+50)
.toFixed(2);

const up =
(Math.random()*400+10)
.toFixed(2);

if(downloadText){

downloadText.innerHTML =
`⬇ ${down} KB/s`;

}

if(uploadText){

uploadText.innerHTML =
`⬆ ${up} KB/s`;

}

},1000);

}

function stopTraffic(){

clearInterval(
trafficInterval
);

trafficInterval = null;

if(downloadText){

downloadText.innerHTML =
"⬇ 0 KB/s";

}

if(uploadText){

uploadText.innerHTML =
"⬆ 0 KB/s";

}

}

// ---------- MODE ----------

const currentMode =
localStorage.getItem("vpnMode")
|| "SSH";

if(modeText){

modeText.innerHTML =
currentMode;

}

if(protocolText){

protocolText.innerHTML =
currentMode;

}

// ---------- CONNEXION ----------

if(vpnSwitch){

vpnSwitch.addEventListener(
"change",
()=>{

const mode =
localStorage.getItem(
"vpnMode"
) || "SSH";

// SSH CHECK

if(mode === "SSH"){

const sshConfig =
JSON.parse(
localStorage.getItem(
"sshConfig"
) || "{}"
);

if(!sshConfig.host){

alert(
"Configure SSH avant connexion"
);

vpnSwitch.checked = false;

return;

}

}

// V2RAY CHECK

if(mode === "V2RAY"){

const v2rayConfig =
JSON.parse(
localStorage.getItem(
"v2rayConfig"
) || "{}"
);

if(!v2rayConfig.uuid){

alert(
"Configure V2Ray avant connexion"
);

vpnSwitch.checked = false;

return;

}

}

if(vpnSwitch.checked){

statusText.innerHTML =
"ON";

stateText.innerHTML =
"Connected";

if(serverStatus){

serverStatus.innerHTML =
"Online";

serverStatus.style.color =
"#00ff88";

}

addLog(
"Starting VPN..."
);

if(mode === "SSH"){

addLog(
"SSH Mode Selected"
);

addLog(
"Loading SSH Profile"
);

addLog(
"Authentication Success"
);

addLog(
"Tunnel Connected"
);

}else{

addLog(
"V2Ray Mode Selected"
);

addLog(
"Loading Config"
);

addLog(
"TLS Handshake Success"
);

addLog(
"Connected"
);

}

startTimer();

startTraffic();

}else{

statusText.innerHTML =
"OFF";

stateText.innerHTML =
"Disconnected";

if(serverStatus){

serverStatus.innerHTML =
"Offline";

serverStatus.style.color =
"#ff5555";

}

stopTimer();

stopTraffic();

addLog(
"VPN Disconnected"
);

}

});

}

// ---------- SAVE SSH ----------

function saveSSH(){

const config = {

host:
document.getElementById(
"sshHost"
)?.value,

port:
document.getElementById(
"sshPort"
)?.value,

username:
document.getElementById(
"sshUser"
)?.value,

password:
document.getElementById(
"sshPass"
)?.value,

payload:
document.getElementById(
"payload"
)?.value,

sni:
document.getElementById(
"sni"
)?.value

};

localStorage.setItem(
"vpnMode",
"SSH"
);

localStorage.setItem(
"sshConfig",
JSON.stringify(config)
);

alert(
"SSH Configuration Saved"
);

}

// ---------- SAVE V2RAY ----------

function saveV2ray(){

const config = {

uuid:
document.getElementById(
"uuid"
)?.value,

network:
document.getElementById(
"network"
)?.value,

host:
document.getElementById(
"host"
)?.value,

path:
document.getElementById(
"path"
)?.value,

sni:
document.getElementById(
"sni"
)?.value,

tls:
document.getElementById(
"tls"
)?.checked,

insecure:
document.getElementById(
"insecure"
)?.checked,

mux:
document.getElementById(
"mux"
)?.checked

};

localStorage.setItem(
"vpnMode",
"V2RAY"
);

localStorage.setItem(
"v2rayConfig",
JSON.stringify(config)
);

alert(
"V2Ray Configuration Saved"
);

}

// ---------- LOAD SSH ----------

const sshConfig =
JSON.parse(
localStorage.getItem(
"sshConfig"
) || "{}"
);

if(
document.getElementById(
"sshHost"
)
){

document.getElementById(
"sshHost"
).value =
sshConfig.host || "";

document.getElementById(
"sshPort"
).value =
sshConfig.port || "";

document.getElementById(
"sshUser"
).value =
sshConfig.username || "";

document.getElementById(
"sshPass"
).value =
sshConfig.password || "";

document.getElementById(
"payload"
).value =
sshConfig.payload || "";

document.getElementById(
"sni"
).value =
sshConfig.sni || "";

}

// ---------- LOAD V2RAY ----------

const v2rayConfig =
JSON.parse(
localStorage.getItem(
"v2rayConfig"
) || "{}"
);

if(
document.getElementById(
"uuid"
)
){

document.getElementById(
"uuid"
).value =
v2rayConfig.uuid || "";

if(
document.getElementById(
"network"
)
){

document.getElementById(
"network"
).value =
v2rayConfig.network
|| "WS";

}

document.getElementById(
"host"
).value =
v2rayConfig.host || "";

document.getElementById(
"path"
).value =
v2rayConfig.path || "";

document.getElementById(
"sni"
).value =
v2rayConfig.sni || "";

if(
document.getElementById(
"tls"
)
){

document.getElementById(
"tls"
).checked =
v2rayConfig.tls
|| false;

}

if(
document.getElementById(
"insecure"
)
){

document.getElementById(
"insecure"
).checked =
v2rayConfig.insecure
|| false;

}

if(
document.getElementById(
"mux"
)
){

document.getElementById(
"mux"
).checked =
v2rayConfig.mux
|| false;

}

}

// ---------- READY ----------

console.log(
"Koshibar Tunnel Loaded Successfully"
);
// ======================
// TRAFFIC CHART
// ======================

const canvas =
document.getElementById("trafficChart");

if(canvas){

const ctx =
canvas.getContext("2d");

let points = [];

function drawChart(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

ctx.beginPath();

ctx.strokeStyle =
"#00ff88";

ctx.lineWidth = 3;

points.forEach((point,index)=>{

const x =
(index * canvas.width) /
(points.length - 1 || 1);

const y =
canvas.height - point;

if(index === 0){

ctx.moveTo(x,y);

}else{

ctx.lineTo(x,y);

}

});

ctx.stroke();

}

setInterval(()=>{

if(vpnSwitch && vpnSwitch.checked){

if(points.length > 40){

points.shift();

}

points.push(
Math.random()*150 + 20
);

drawChart();

}

},1000);

}
