const fan = document.getElementById('fan');
const btnOn = document.getElementById('On');
const btnOff = document.getElementById('Off');
const btnS1 = document.getElementById('speed1');
const btnS2 = document.getElementById('speed2');
const btnS3 = document.getElementById('speed3');

let Power= false;


btnOn.addEventListener('click', function(){
  Power=true;
  fan.classList.add('animation');
  fan.style.animationDuration= `1s`;
})
btnOff.addEventListener('click', function(){
  Power=false;
  fan.classList.remove('animation');
})
btnS1.addEventListener('click', function(){
  if(Power){
  fan.classList.add('animation');
  fan.style.animationDuration= `600ms`;
    }
})
btnS2.addEventListener('click', function(){
  if(Power){
    
  fan.classList.add('animation');
  fan.style.animationDuration= `500ms`;
  }
})
btnS3.addEventListener('click', function(){
  if(Power){
  fan.classList.add('animation');
  fan.style.animationDuration= `300ms`;
    
  }
})
