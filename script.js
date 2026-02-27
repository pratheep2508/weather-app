let apiKey="2cb5bab9f5335d425b5e11656e8834de";


/* CLOCK */

function updateClock(){

let now=new Date();

document.getElementById("date").innerHTML=
now.toDateString();

document.getElementById("clock").innerHTML=
now.toLocaleTimeString();

}

setInterval(updateClock,1000);

updateClock();



/* ENTER KEY */

document.getElementById("city")
.addEventListener("keypress",function(e){

if(e.key==="Enter")
getWeather();

});



/* DARK MODE */

function darkMode(){

document.body.classList.toggle("dark");

}



/* WEATHER */

function getWeather(){

let c=document.getElementById("city").value.trim();

if(c===""){

document.getElementById("weatherResult").innerHTML=
"Enter city name";

return;

}


/* Smooth Loading */

weatherResult.classList.remove("show");

weatherResult.classList.add("fade");

weatherResult.innerHTML="Loading...";

forecast.innerHTML="";



/* CURRENT WEATHER */

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${c}&appid=${apiKey}&units=metric`)

.then(res=>res.json())

.then(data=>{


if(data.cod!=200){

weatherResult.innerHTML="City not found";
return;

}


/* Save History */

saveHistory(c);


let temp=data.main.temp;

let weather=data.weather[0].main;

let country=data.sys.country;

let icon=data.weather[0].icon;

let iconURL=
`https://openweathermap.org/img/wn/${icon}@2x.png`;


/* Smooth Show */

setTimeout(()=>{

weatherResult.innerHTML=

`<img src="${iconURL}">
<br>
<b>${c}, ${country}</b>
<br>
${temp} °C
<br>
${weather}`;

weatherResult.classList.remove("fade");

weatherResult.classList.add("show");

},300);

});



/* FORECAST */

fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${c}&appid=${apiKey}&units=metric`)

.then(res=>res.json())

.then(data=>{


let html="";


let temps=[];
let labels=[];


for(let i=0;i<5;i++){

let item=data.list[i*8];

let temp=item.main.temp;

let weatherType=item.weather[0].main;

let d=new Date(item.dt_txt);

let day=d.toLocaleDateString('en-US',{
weekday:'short'
});


labels.push(day);
temps.push(temp);


/* Colored Icons */

let icon="☀️";
let color="#FFD700";


if(weatherType=="Clouds"){

icon="☁️";
color="#4da6ff";

}

else if(weatherType=="Rain"){

icon="🌧️";
color="#66ccff";

}


html+=`

<div class="forecastCard">

${day}

<br>

<div class="weatherIcon"
style="color:${color}">

${icon}

</div>

${temp}°C

</div>

`;

}


forecast.innerHTML=html;


/* Temperature Chart */

drawChart(labels,temps);

});

}



/* LOCATION */

function getLocationWeather(){

navigator.geolocation.getCurrentPosition(pos=>{

let lat=pos.coords.latitude;
let lon=pos.coords.longitude;


fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)

.then(res=>res.json())

.then(data=>{

city.value=data.name;

getWeather();

});

});

}



/* SEARCH HISTORY FIXED */

function saveHistory(cityName){

let historyList=
JSON.parse(localStorage.getItem("cities"))||[];

if(!historyList.includes(cityName)){

historyList.push(cityName);

}

localStorage.setItem(
"cities",
JSON.stringify(historyList)
);

showHistory();

}



function showHistory(){

let historyList=
JSON.parse(localStorage.getItem("cities"))||[];

let text="";


historyList.slice(-5).reverse().forEach(cityName=>{

text+=`<div class="historyItem"
onclick="loadCity('${cityName}')">
${cityName}
</div>`;

});


document.getElementById("history").innerHTML=text;

}



function loadCity(cityName){

document.getElementById("city").value=cityName;

getWeather();

}


showHistory();



/* CLEAR */

function clearData(){

localStorage.removeItem("cities");

document.getElementById("history").innerHTML="";

forecast.innerHTML="";

weatherResult.innerHTML=
"Enter a city to see weather";

city.value="";

}



/* TEMPERATURE GRAPH */

function drawChart(labels,temps){

let oldChart=document.getElementById("chart");

if(oldChart) oldChart.remove();


let canvas=document.createElement("canvas");

canvas.id="chart";

canvas.height=150;

document.querySelector(".container")
.appendChild(canvas);


let ctx=canvas.getContext("2d");


new Chart(ctx,{

type:'line',

data:{

labels:labels,

datasets:[{

label:'Temperature °C',

data:temps,

borderWidth:3

}]

},

options:{

responsive:true

}

});

}