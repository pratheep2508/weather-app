let apiKey = "2cb5bab9f5335d425b5e11656e8834de";


/* ========== CLOCK ========== */

function updateClock(){

let now = new Date();

document.getElementById("clock").innerHTML =
now.toLocaleTimeString();

document.getElementById("date").innerHTML =
now.toDateString();

}

setInterval(updateClock,1000);

updateClock();



/* ========== ENTER KEY SEARCH ========== */

document.getElementById("city")

.addEventListener("keypress",function(e){

if(e.key === "Enter"){
getWeather();
}

});



/* ========== DARK MODE ========== */

function darkMode(){

document.body.classList.toggle("dark");

}



/* ========== GET WEATHER ========== */

function getWeather(){

let city =
document.getElementById("city").value.trim();

if(city === ""){

document.getElementById("weatherResult").innerHTML =
"Enter a city name";

return;

}


document.getElementById("weatherResult").innerHTML =
"Loading...";



fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)

.then(response => response.json())

.then(data => {


/* City Not Found Fix */

if(data.cod !== 200){

document.getElementById("weatherResult").innerHTML =
"City not found";

document.getElementById("forecast").innerHTML = "";

return;

}


/* Save History Only if Valid */

saveHistory(city);


let temp = data.main.temp;

let weather = data.weather[0].main;

let country = data.sys.country;

let icon = data.weather[0].icon;

let iconURL =
`https://openweathermap.org/img/wn/${icon}@2x.png`;


document.getElementById("weatherResult").innerHTML =

`<img src="${iconURL}">
<br>
<b>${city}, ${country}</b>
<br>
${temp} °C
<br>
${weather}`;

});



/* ========== FORECAST ========== */

fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)

.then(response => response.json())

.then(data => {

if(data.cod !== "200"){

document.getElementById("forecast").innerHTML = "";

return;

}

let html = "";

for(let i=0;i<5;i++){

let item = data.list[i*8];

let temp = item.main.temp;

let icon = item.weather[0].icon;

let iconURL =
`https://openweathermap.org/img/wn/${icon}.png`;

html +=

`<div class="forecastCard">

<img src="${iconURL}">
<br>
${temp}°C

</div>`;

}

document.getElementById("forecast").innerHTML =
html;

});

}



/* ========== LOCATION WEATHER ========== */

function getLocationWeather(){

navigator.geolocation.getCurrentPosition(function(pos){

let lat = pos.coords.latitude;
let lon = pos.coords.longitude;


fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)

.then(response => response.json())

.then(data => {

let city = data.name;

document.getElementById("city").value = city;

getWeather();

});

});

}



/* ========== SEARCH HISTORY ========== */

function saveHistory(city){

let history =
JSON.parse(localStorage.getItem("cities")) || [];


/* Avoid duplicates */

if(!history.includes(city)){

history.push(city);

}


/* Save */

localStorage.setItem(
"cities",
JSON.stringify(history)
);


showHistory();

}



function showHistory(){

let history =
JSON.parse(localStorage.getItem("cities")) || [];


let text = "";


history.slice(-5).reverse().forEach(city=>{

text += city + "<br>";

});


document.getElementById("history").innerHTML =
text;

}


showHistory();



/* ========== CLEAR BUTTON ========== */

function clearData(){

localStorage.removeItem("cities");

document.getElementById("history").innerHTML="";

document.getElementById("forecast").innerHTML="";

document.getElementById("weatherResult").innerHTML=
"Enter a city to see weather";

document.getElementById("city").value="";

}