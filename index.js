

function updateTime(d = new Date()) {
    document.querySelector("h1").textContent = d.getHours().toString().padStart(2, '0') + ":" +
                                         d.getMinutes().toString().padStart(2, '0');
}
updateTime();

function runIntro() {
  const c = document.querySelector('.container');
  const r1 = c.querySelector('.rec1');
  const r2 = c.querySelector('.rec2');
  const r3 = c.querySelector('.rec3');
  const r4 = c.querySelector('.rec4');

  
  r1.classList.add('enter-left');
  r2.classList.add('enter-top');
  r3.classList.add('enter-right');
  r4.classList.add('enter-bottom');

  
    r1.addEventListener('animationend', e => {

        r1.classList.remove('enter-left', 'enter-top', 'enter-right', 'enter-bottom');
        r1.style.opacity = '0.8';
        //setTimeout(()=> r4.style.opacity = '1', 700);
         r1.classList.add('rotateH');
    }, { once: false });
    r2.addEventListener('animationend', e => {

        r2.classList.remove('enter-left', 'enter-top', 'enter-right', 'enter-bottom');
        r2.style.opacity = '1';
        r2.classList.add('rotate');
    }, { once: false });
    r3.addEventListener('animationend', e => {

        r3.classList.remove('enter-left', 'enter-top', 'enter-right', 'enter-bottom');
        r3.style.opacity = '1';
        r3.classList.add('rotateV');
    }, { once: false });
    r4.addEventListener('animationend', e => {

        r4.classList.remove('enter-left', 'enter-top', 'enter-right', 'enter-bottom');
        r4.style.opacity = '0.9';
        r4.classList.add('rotateH');
    }, { once: false });
  
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runIntro);
} else {
  runIntro();
}

let timerId;
let paused = false;

function scheduleNextTick() {
    if (paused) return;
  const now = new Date();
  const toNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
  timerId = setTimeout(tick, Math.max(0, toNextMinute));
}

function tick() {
    if (paused) return;
  updateTime();
  scheduleNextTick(); 
}

function startClock() {
    if (paused) return;
    clearTimeout(timerId);
  updateTime();        
  scheduleNextTick(); 
}
function stopClock() {
  paused = true;
  clearTimeout(timerId);
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !paused) {
    clearTimeout(timerId);
    updateTime();
    scheduleNextTick();
  }
});

startClock();

button = document.querySelector(".timer");
button.addEventListener('click', () => {
    
    if(!paused) {
        stopClock();
        setTimeout(() => {    
            document.querySelector("h1").textContent = "00:00";
            document.querySelector("h1").contentEditable = "true";
        }, 3000);
    }
    else {
        paused = false;
        document.querySelector("h1").contentEditable = "false";
        setTimeout(() => {
            
            startClock();
        }, 3000);
    }
  const recs = document.querySelectorAll('.rec1,.rec2,.rec3,.rec4');

  recs.forEach(el => {
    el.classList.remove(
      'rotateH','rotate','rotateV',
      'enter-left','enter-right','enter-top','enter-bottom',
      'out-left','out-right','out-top','out-bottom'
    );
    el.style.animation = 'none';
    el.style.opacity = '1'; 
  });

  void document.body.offsetWidth;

  recs.forEach(el => {
    el.style.animation = '';
  });
  

  document.querySelector('.rec4').classList.add('out-bottom');
  document.querySelector('.rec3').classList.add('out-top');
  document.querySelector('.rec2').classList.add('out-right');
  document.querySelector('.rec1').classList.add('out-left');
});