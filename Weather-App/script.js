// all the important nodes we needed for dom manipulation
const temp = document.querySelector('.temp');
const cityTime = document.querySelector('.time');
const cityName = document.querySelector('.name');
const cityDate = document.querySelector('.date');
const input = document.querySelector('.search');
const submit = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const cloudPerc = document.querySelector('.cloud');
const humidPerc = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind');
const form = document.querySelector('.locationInput');
const condition = document.querySelector('.condition')
const icon  = document.querySelector(".icon");
const weather = document.querySelector(".weather-app")
let currCity = "London";
// ---------------end----------------------------------




// adding click event to all the cities
cities.forEach((city)=>{
  city.addEventListener('click',()=>{
  currCity=city.innerHTML;
  console.log(currCity)
    fetchWeather(currCity);
  })
})
// -----------end-----------------


// handling form submission
form.addEventListener('submit',(e)=>{
    e.preventDefault();
  if(input.value.length==0){
    alert("Please enter a city name");
  }
  else{
    currCity=input.value;
    fetchWeather(currCity);
    console.log(currCity);
    form.reset();
  }
  
})
// -----------end-----------


// days of the week 
function dayOFTheWeek(day, month ,date){
  const weekday=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];
  const monthNames= [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${weekday[day]} ${monthNames[month]} ${date}`;
}
// -----------------end--------------




// function to get icon url
function getIconUrl(iconCode){
  const url = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  icon.src=url;
}
// ------end--------------



// function to change background images as per weather
function bgChange(typeOfWeather){
  console.log(typeOfWeather);
  if(typeOfWeather=="Rain"){
    weather.style.backgroundImage="url('./Assets/rain.jpg')";
  }
  else if(typeOfWeather=="Clouds"){
       weather.style.backgroundImage="url('./Assets/Cloudy Weather.webp')";  
  }
  else if(typeOfWeather=="Snow"){
       weather.style.backgroundImage="url('./Assets/Snow.jpg')";
  }
  else if(typeOfWeather=="Clear"){
     weather.style.backgroundImage="url('./Assets/Clear-Weather.jpg')";
  }
  else if(typeOfWeather=="Thunderstorm"){
     weather.style.backgroundImage="url('./Assets/thunderstorm.jpg')";
  }
  else if(typeOfWeather=="Drizzle"){
     weather.style.backgroundImage="url('./Assets/Drizzle.jpg')";
  }
  else if(typeOfWeather=="Mist" || typeOfWeather=="Smoke" || typeOfWeather=="Haze" || typeOfWeather=="Fog"){
     weather.style.backgroundImage="url('./Assets/foggy-mist.jpg')";
  }
  else if (typeOfWeather=="Dust" || typeOfWeather=="Sand" || typeOfWeather=="Ash"){
     weather.style.backgroundImage="url('./Assets/sand-dust.jpg')";
  }}
// ----------------------end-------------------


// fetcher function using axios with async and await
async function fetchWeather(currCity){
  const url =`https://api.openweathermap.org/data/2.5/weather?q=${currCity}`;
  const key  = "fe16784c1cfd2ae86efe142a8771568e";
  const completeUrl = url+`&appid=${key}`
  const response = await axios(completeUrl);
  const data = response.data;
  temp.innerText = Math.round(data.main.temp - 273.15) + "°C";
  cityName.innerText=data.name;
  condition.innerHTML=data.weather[0].main;
  humidPerc.innerHTML=data.main.humidity + "%";
  cloudPerc.innerHTML=data.clouds.all + "%";
  windSpeed.innerHTML= (data.wind.speed)*3.6 + " km/h";
  const mydate = new Date(data.dt*1000);
  const date = mydate.getDate();
  const day=mydate.getDay();
  const month = mydate.getMonth();
  cityDate.innerText=dayOFTheWeek(day,month,date);
  getIconUrl(data.weather[0].icon);
  bgChange(data.weather[0].main);
}
// ----------------end-----------------
