const canvas = document.getElementById('birthdayCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const fireworks = [];
const text = 'TML小小生日快乐';
let textParticles = [];
let textIndex = 0;

class Particle {
    constructor(x, y) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 20) + 5;
        this.distance = 100;
        this.color = 'rgba(255, 255, 255, 0.7)';
        this.speed = 0.05;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        let dx = this.baseX - this.x;
        let dy = this.baseY - this.y;
        this.x += dx * this.speed;
        this.y += dy * this.speed;
    }
}

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.size = 2;
        this.speed = Math.random() * 2 + 3;
        this.gravity = 0.1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.particles = [];
        this.sound = new Audio('explosion.mp3');  // 添加爆炸音效
    }

    update() {
        this.speed -= this.gravity;
        this.y -= this.speed;
        if (this.speed <= 0) {
            this.explode();
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    explode() {
        this.sound.play();  // 播放爆炸音效
        for (let i = 0; i < 50; i++) {
            this.particles.push(new FireworkParticle(this.x, this.y, this.color));
        }
        fireworks.splice(fireworks.indexOf(this), 1);
    }
}

class FireworkParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speed = (Math.random() - 0.5) * 5;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.gravity = 0.1;
        this.color = color;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function init() {
    particles.length = 0;
    textParticles.length = 0;
    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width/2, canvas.height/2);
    
    const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < textCoordinates.height; y += 3) {
        for (let x = 0; x < textCoordinates.width; x += 3) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + (canvas.width/2 - textCoordinates.width/2);
                let positionY = y + (canvas.height/2 - textCoordinates.height/2);
                textParticles.push(new Particle(positionX, positionY));
            }
        }
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 逐渐添加文字粒子
    if (textIndex < textParticles.length) {
        particles.push(textParticles[textIndex]);
        textIndex++;
    }
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
    }
    
    if (Math.random() < 0.02 && fireworks.length < 5) {
        fireworks.push(new Firework());
    }
    
    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        for (let j = fireworks[i].particles.length - 1; j >= 0; j--) {
            fireworks[i].particles[j].update();
            fireworks[i].particles[j].draw();
            if (fireworks[i].particles[j].alpha <= 0) {
                fireworks[i].particles.splice(j, 1);
            }
        }
        if (fireworks[i].particles.length === 0) {
            fireworks.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();