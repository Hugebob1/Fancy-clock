

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

function bounce(){
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
}

const container = document.querySelector('.container'); 

function startRotations() {
  container.classList.remove('paused');  
}

function stopRotations() {
  container.classList.add('paused');     
}

button = document.querySelector(".timer.t");
button.addEventListener('click', () => {
    
    if(!paused) {
        stopClock();
        setTimeout(() => {    
            document.querySelector("h1").textContent = "00:00";
            document.querySelector("h1").contentEditable = "true";
            stopRotations();
        }, 3000);
        
    }
    else {
        paused = false;
        document.querySelector("h1").contentEditable = "false";
        startRotations();
        setTimeout(() => {
            
            startClock();
        }, 3000);
    }
  bounce();
});

function normalizeClock(h1) {
  const txt = h1.textContent.trim();

  const m = txt.match(/^(\d{1,2})\s*:\s*(\d{1,2})$/);
  if (!m) return false;

  let H = parseInt(m[1], 10);
  let M = parseInt(m[2], 10);

  if (Number.isNaN(H) || Number.isNaN(M)) return false;
  if (H < 0 || H > 99 || M < 0 || M > 59) return false;

  const hh = H.toString().padStart(2, '0');
  const mm = M.toString().padStart(2, '0');

  h1.textContent = `${hh}:${mm}`;
  return true;
}
const h1 = document.querySelector('h1');
h1.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertLineBreak') e.preventDefault();
});

h1.addEventListener('blur', () => normalizeClock(h1));

h1.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (normalizeClock(h1)) h1.blur();  
  } else if (e.key === 'Escape') {
    e.preventDefault();
    h1.blur(); 
  }
});

function makeSound(){
    var audio1 = new Audio("./sounds/crash.mp3");
    audio1.play();
    setTimeout(() => {
        var audio2 = new Audio("./sounds/kick-bass.mp3");
        audio1.play();
    }, 500);
}


function parseMMSS(h1) {
  const m = h1.textContent.trim().match(/^(\d{1,2})\s*:\s*(\d{1,2})$/);
  if (!m) return null;
  let M = parseInt(m[1], 10);
  let S = parseInt(m[2], 10);
  if (Number.isNaN(M) || Number.isNaN(S)) return null;
  if (M < 0 || M > 99 || S < 0 || S > 59) return null; 
  return { m: M, s: S };
}

function setMMSS(h1, M, S) {
  const mm = Math.min(99, Math.max(0, M)).toString().padStart(2, '0');
  const ss = Math.min(59, Math.max(0, S)).toString().padStart(2, '0');
  h1.textContent = `${mm}:${ss}`;
}
function normalizeMMSS(h1) {
  const t = parseMMSS(h1);
  if (!t) return false;
  setMMSS(h1, t.m, t.s);
  return true;
}
function createCountdown(h1) {
  let timer = null;

  function tick() {
    const t = parseMMSS(h1);
    if (!t) return;
    let { m, s } = t;

    if (m === 0 && s === 0) { 
        makeSound();
        stopRotations();
      clearInterval(timer); timer = null; return;
    }

    if (s === 0) { s = 59; m = Math.max(0, m - 1); }
    else { s -= 1; }

    setMMSS(h1, m, s);
  }

  return {
    start() {
      if (timer) return;
      if (!normalizeMMSS(h1)) setMMSS(h1, 0, 0);
      timer = setInterval(tick, 1000);
    },
    stop() { if (timer) { clearInterval(timer); timer = null; } },
    reset(to = '00:00') { this.stop(); h1.textContent = to; normalizeMMSS(h1); },
    isRunning() { return !!timer; }
  };
}


if (!normalizeMMSS(h1)) h1.textContent = '00:00';

const sw = createCountdown(h1);

buttonS = document.querySelector(".timer.s");
buttonS.addEventListener('click', () => {
    if(paused){
        if (sw.isRunning()){
            stopRotations();
            sw.stop(); 
        }
        else{
            startRotations();
            sw.start();
        } 

    }
});