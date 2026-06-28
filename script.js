const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const duckIntro = document.getElementById("duckIntro");
const angyDuck = document.getElementById("angyDuck");
let noAttempts = 0;
const angyImages = [

    "angy-duck-1.png",
    "angy-duck-2.png",
    "angy-duck-3.png",
    "angy-duck-4.png",
    "angy-duck-5.png",
    "angy-duck-6.png",
    "angy-duck-7.png",
    "angy-duck-8.png",
    "angy-duck-9.png",
    "angy-duck-10.png"
];

function moveNoButton(){

    const buttonWidth = noBtn.offsetWidth;
    const buttonHeight = noBtn.offsetHeight;

    const maxX = window.innerWidth - buttonWidth;
    const maxY = window.innerHeight - buttonHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    noBtn.style.position = "fixed";

    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";

    angyDuck.style.display = "block";

    angyDuck.src = angyImages[noAttempts];
    noAttempts++;
    if(noAttempts >= angyImages.length) {
        noAttempts = 0;
    }
}
yesBtn.addEventListener(
"click",
()=>{

    document
    .querySelector("#loveQuestion h2")
    .innerText =
    "Good boy ❤️";

    document
    .querySelector(".choiceButtons")
    .style.display =
    "none";

    setTimeout(()=>{

        duckIntro.classList
        .add("fade-out");

    },1200);

    setTimeout(() => {
    duckIntro.style.display = "none";

    const intro = document.getElementById("intro");
    intro.style.display = "flex";

    // force reflow so animations + layout kick in
    intro.getBoundingClientRect();

}, 2200);

});


const gift = document.getElementById("gift");
const message = document.getElementById("message");
const scene = document.getElementById("scene");
const fwCanvas = document.getElementById("fireworks");
const fwCtx = fwCanvas.getContext("2d");
const heartCanvas = document.getElementById("heartCanvas");
const heartCtx = heartCanvas.getContext("2d");

let fwParticles = [];

function resizeFireworksCanvas() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeFireworksCanvas);
resizeFireworksCanvas();

function resizeHeartCanvas() {
    heartCanvas.width = window.innerWidth;
    heartCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeHeartCanvas);
resizeHeartCanvas();

// ── FIREWORKS ──
function launchFireworks(bursts = 3) {
    const palette = ["#ff8fab", "#ffb3c6", "#ff6fa3", "#ffd6e8", "#ff4f8b"];

    for (let b = 0; b < bursts; b++) {
        setTimeout(() => {
            const x = Math.random() * fwCanvas.width;
            const y = Math.random() * fwCanvas.height * 0.5 + 50;
            const color = palette[Math.floor(Math.random() * palette.length)];
            for (let i = 0; i < 40; i++) {
                const angle = (Math.PI * 2 * i) / 40;
                const speed = 2 + Math.random() * 3;
                fwParticles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    color
                });
            }
        }, b * 300);
    }
}

function animateFireworks() {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

    fwParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.alpha -= 0.015;

        fwCtx.globalAlpha = Math.max(p.alpha, 0);
        fwCtx.fillStyle = p.color;
        fwCtx.beginPath();
        fwCtx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        fwCtx.fill();
    });
    fwParticles = fwParticles.filter(p => p.alpha > 0);
    fwCtx.globalAlpha = 1;

    requestAnimationFrame(animateFireworks);
}
animateFireworks();

// ── GIFT DODGE (flees on cursor approach, like the "No" button trick) ──
let dodgeCount = 0;
const maxDodges = 6;

gift.style.position = "absolute";

function dodgeGift() {
    dodgeCount++;

    const maxX =
        window.innerWidth -
        gift.offsetWidth;

    const maxY =
        window.innerHeight -
        gift.offsetHeight;

    const x =
        Math.random() * maxX;

    const y =
        Math.random() * maxY;

    gift.style.position = "fixed";

    gift.style.left = x + "px";
    gift.style.top = y + "px";

    if (dodgeCount === 1)
message.innerText = "Come on now, take it 😌";

else if (dodgeCount === 2)
message.innerText = "Try harder jaan 😏";

else if (dodgeCount === 3)
message.innerText = "You almost got it 🤭";

else if (dodgeCount === 4)
message.innerText = "Nope. Again 😌";

else if (dodgeCount === 5)
message.innerText = "Still not fast enough 😏";

else if (dodgeCount === 6)
message.innerText = "Okay okay, now you can have it ❤️";
}

// Desktop: flee as soon as the cursor touches it
gift.addEventListener("mouseenter", () => {
    if (dodgeCount < maxDodges) dodgeGift();
});

// Mobile: flee on first touch contact (fires before click)
gift.addEventListener("touchstart", (e) => {
    if (dodgeCount < maxDodges) {
        e.preventDefault();
        dodgeGift();
    }
}, { passive: false });

// Catch: only works once it's done fleeing
gift.addEventListener("click", () => {
    if (dodgeCount >= maxDodges) {
        message.innerText = "Finally, you got it ❤️";
        launchFireworks();
        setTimeout(startLoveScene, 1200);
    }
});

function startLoveScene() {
    document.getElementById("intro").style.display = "none";

    const love = document.getElementById("loveScene");
    love.style.display = "flex";

    document.body.classList.add("not-loaded");
    setTimeout(() => {
        document.body.classList.remove("not-loaded");
    }, 200);

    // Flowers take ~4.8s (longest --d) + ~2s bloom = roughly 6.8s to finish.
    // Trigger fireworks + heart section automatically once they're done.
    setTimeout(() => {
    showFinalHeartScene();
}, 6500);
}

// ── "I LOVE YOU" HEART TEXT LOOP ──
let heartOffset = 0;
let heartRunning = false;
const heartTextCount = 130; // how many "I love you" instances trace the path

function heartPoint(t) {
    // classic parametric heart curve
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x, y };
}

function startHeartAnimation() {
    if (heartRunning) return;
    heartRunning = true;
    heartCanvas.classList.add("show");
    requestAnimationFrame(animateHeart);
}

function animateHeart() {
    heartCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);

    const cx = heartCanvas.width / 2;
    const cy = heartCanvas.height / 2;
    const scale = Math.min(heartCanvas.width, heartCanvas.height) / 16;

    heartCtx.font = "700 11px Spectral";
    heartCtx.textAlign = "center";
    heartCtx.textBaseline = "middle";
    heartCtx.fillStyle = "#ffc1d9";
    heartCtx.shadowColor = "#ff4f8b";
    heartCtx.shadowBlur = 40;

    for (let i = 0; i < heartTextCount; i++) {
        const t = ((i / heartTextCount) * Math.PI * 2 + heartOffset) % (Math.PI * 2);
        const p1 = heartPoint(t);
        const p2 = heartPoint(t + 0.01); // tiny step ahead, used to find direction of travel

        const x = cx + p1.x * scale;
        // heart formula points downward on screen already, so this flips it upright
        const y = cy - p1.y * scale;

        const angle = Math.atan2(-(p2.y - p1.y), p2.x - p1.x);

        heartCtx.save();
        heartCtx.translate(x, y);
        heartCtx.rotate(angle);
        heartCtx.fillText("I love you", 0, 0);
        heartCtx.restore();
    }

    heartOffset += 0.01; // controls how fast the text travels around the loop
    requestAnimationFrame(animateHeart);
}
document.addEventListener("mousemove", (e) => {

    const rect = noBtn.getBoundingClientRect();

    const distanceX =
        Math.abs(e.clientX - (rect.left + rect.width / 2));

    const distanceY =
        Math.abs(e.clientY - (rect.top + rect.height / 2));

    if (
        distanceX < 120 &&
        distanceY < 80
    ) {
        moveNoButton();
    }
});

noBtn.addEventListener("click", (e) => {

    e.preventDefault();

    alert("😤 Huh? Wrong answer. Try again.");

    location.reload();
});

function showFinalHeartScene(){

    document.getElementById("loveScene").style.display = "none";

    const heartScene =
    document.getElementById("heartScene");

    heartScene.style.display = "flex";

    start3DHeart();
}
function start3DHeart(){

    const canvas =
    document.getElementById("heart3D");

    const ctx =
    canvas.getContext("2d");

    function resize(){
        canvas.width =
        window.innerWidth;

        canvas.height =
        window.innerHeight;
    }

    resize();

    window.addEventListener(
        "resize",
        resize
    );

    const phrases = [
        "I love you",
        "forever",
        "my jaan",
        "always",
        "my chagol",
        "❤️"
    ];

    let angle = 0;

    const rings = 10;
    const pointsPerRing = 60;

    function heartPoint3D(t, ring, scale){

        const x =
        16 * Math.pow(Math.sin(t), 3);

        const y =
        -(13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t));

        const z =
        (ring - (rings - 1) / 2) * 1.4;

        return{
            x:x * scale,
            y:y * scale,
            z:z * scale
        };
    }
 let basePoints = [];
    let phraseIndex = 0;
 
    function buildPoints(){
        basePoints = [];
        phraseIndex = 0;
        const scale = Math.min(canvas.width, canvas.height) / 38;
 
        for (let r = 0; r < rings; r++){
            for (let i = 0; i < pointsPerRing; i++){
                const t = (i / pointsPerRing) * Math.PI * 2;
                const p = heartPoint3D(t, r, scale);
                basePoints.push({
                    ...p,
                    text: phrases[phraseIndex++ % phrases.length]
                });
            }
        }
    }
    buildPoints();
    window.addEventListener("resize", buildPoints);

    function animate(){
 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
 
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
 
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
 
        const pts = basePoints.map(p => {
            const rotX = p.x * cosA - p.z * sinA;
            const rotZ = p.x * sinA + p.z * cosA;
            const perspective = 320 / (320 + rotZ);
 
            return {
                x: cx + rotX * perspective,
                y: cy + p.y * perspective,
                z: rotZ,
                perspective,
                text: p.text
            };
        });
 
        // draw far points first so the near side overlaps correctly
        pts.sort((a, b) => b.z - a.z);
 
        pts.forEach(p => {
            const alpha = Math.max(0.3, Math.min(1, 0.4 + p.perspective));
 
            ctx.fillStyle = `rgba(255, 190, 220, ${alpha})`;
            ctx.font = `${Math.max(10, 14 * p.perspective)}px Caveat`;
            ctx.fillText(p.text, p.x, p.y);
        });
 
        // SLOW, smooth rotation — this is the actual fix.
        // 0.08/frame was nearly a full extra rotation every second; 0.006 is a gentle, steady spin.
        angle += 0.006;
 
        requestAnimationFrame(animate);
    }
 
    animate();
}