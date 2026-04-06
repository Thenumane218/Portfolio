const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Animated counters
function animateCounter(el, target, prefix = "") {
  let current = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = prefix + current;
    if (current >= target) clearInterval(timer);
  }, 120);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;

        const targetStr = el.textContent.replace(/\D/g, "");
        const targetNum = parseInt(targetStr, 10);

        el.textContent = "+0";

        animateCounter(el, targetNum, "+");

        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll(".stat-value").forEach((el) => {
  counterObserver.observe(el);
});

const floatingNav = document.querySelector(".floating-nav");
if (floatingNav) {
  let lastY = window.scrollY;
  let ticking = false;

  const updateNavVisibility = () => {
    const currentY = window.scrollY;
    const delta = currentY - lastY;

    if (currentY <= 12 || delta < -6) {
      floatingNav.classList.remove("is-hidden");
    } else if (delta > 6) {
      floatingNav.classList.add("is-hidden");
    }

    lastY = currentY;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavVisibility);
        ticking = true;
      }
    },
    { passive: true },
  );
}

// --- Interactive Tech Stack Constellation ---
const initConstellation = () => {
  const container = document.getElementById("tech-container");
  const canvas = document.getElementById("constellation");
  if (!container || !canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  // Track mouse position relative to the container
  let mouse = { x: null, y: null, radius: 150 };

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  container.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  const resize = () => {
    width = container.offsetWidth;
    height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
  };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1; // Dot size
      this.speedX = Math.random() * 1 - 0.5; // Float speed
      this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off edges
      if (this.x > width || this.x < 0) this.speedX *= -1;
      if (this.y > height || this.y < 0) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(249, 115, 22, 0.4)"; // Your accent color, dimmed
      ctx.fill();
    }
  }

  const initParticles = () => {
    particles = [];
    // Adjust number of particles based on screen width so it isn't cluttered on mobile
    const numberOfParticles = (width * height) / 12000;
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  };

  const connect = () => {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let distance =
          (particles[a].x - particles[b].x) ** 2 +
          (particles[a].y - particles[b].y) ** 2;

        // Connect dots to each other
        if (distance < 15000) {
          opacityValue = 1 - distance / 15000;
          ctx.strokeStyle = `rgba(249, 115, 22, ${opacityValue * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }

      // Connect dots to the mouse cursor
      if (mouse.x != null) {
        let mouseDistance =
          (particles[a].x - mouse.x) ** 2 + (particles[a].y - mouse.y) ** 2;
        if (mouseDistance < 20000) {
          opacityValue = 1 - mouseDistance / 20000;
          ctx.strokeStyle = `rgba(249, 115, 22, ${opacityValue * 0.5})`; // Brighter near mouse
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
  };

  window.addEventListener("resize", resize);
  resize();
  animate();
};

// Start the animation
initConstellation();

// --- Coming Soon Toast Logic ---
const toast = document.getElementById('toast-coming-soon');
let toastTimer;

// Grab all the rows in the "Project Thoughts" section
const thoughtRows = document.querySelectorAll('.thought-row');

thoughtRows.forEach(row => {
  row.addEventListener('click', (e) => {
    e.preventDefault(); 

    // 1. Remove the hidden state classes
    toast.classList.remove('opacity-0', '-translate-y-[150%]');
    // 2. Add the visible state classes
    toast.classList.add('opacity-100', 'translate-y-0');

    // Clear any existing timer
    clearTimeout(toastTimer);

    // Hide the toast after 3 seconds by swapping the classes back
    toastTimer = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', '-translate-y-[150%]');
    }, 3000);
  });
});

// --- Contact Form Backend Logic ---
const contactForm = document.getElementById('contact-form');
const formResult = document.getElementById('form-result');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    // Prevent the default browser refresh
    e.preventDefault();

    // Package the data
    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Save original button state
    const originalBtnText = submitBtn.innerHTML;
    const originalBtnColor = submitBtn.style.background;
    
    // UI update: "Sending..."
    submitBtn.innerHTML = "SENDING... ⏳";
    submitBtn.style.opacity = "0.7";
    submitBtn.style.cursor = "not-allowed";
    submitBtn.disabled = true;

    // Send to Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            // UI update: Success!
            formResult.classList.remove('hidden');
            formResult.style.color = '#22c55e'; // Green text
            formResult.innerHTML = "Message sent successfully! I'll get back to you soon.";
            
            submitBtn.innerHTML = "SENT ✔";
            submitBtn.style.background = "#22c55e"; // Green button
            
            contactForm.reset();
        } else {
            // UI update: API Error
            formResult.classList.remove('hidden');
            formResult.style.color = '#ef4444'; // Red text
            formResult.innerHTML = json.message;
            
            // Revert button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.background = originalBtnColor;
            submitBtn.disabled = false;
        }
    })
    .catch(error => {
        // UI update: Network Error
        formResult.classList.remove('hidden');
        formResult.style.color = '#ef4444'; // Red text
        formResult.innerHTML = "Something went wrong! Please try again.";
        
        // Revert button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.style.background = originalBtnColor;
        submitBtn.disabled = false;
    })
    .then(function() {
        // Reset everything back to normal after 4 seconds
        setTimeout(() => {
            formResult.classList.add('hidden');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.background = originalBtnColor;
            submitBtn.style.opacity = "1";
            submitBtn.style.cursor = "pointer";
            submitBtn.disabled = false;
        }, 4000);
    });
  });
}
