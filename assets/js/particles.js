const canvas = document.getElementById("particles")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particles = []

for (let i = 0; i < 25; i++) {
        
        particles.push({
                
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3
                
        })
        
}

function animate() {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        particles.forEach(p => {
                
                p.x += p.dx
                p.y += p.dy
                
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = "rgba(0,255,255,0.2)"
                ctx.fill()
                
        })
        
        requestAnimationFrame(animate)
        
}

animate()