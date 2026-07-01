(function () {
    // Reset scroll position to top on page refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const wrapper = document.querySelector(".wrapper-3d");
    const sections = document.querySelectorAll(".container");
    const controls = document.querySelectorAll(".control");
    const maxDepth = 4500; // 3 gaps of 1500px

    let targetZ = 0;
    let currentZ = 0;
    let animFrameId = null;

    function updateScrollPercent() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        let scrollPercent = 0;
        if (maxScroll > 0) {
            scrollPercent = scrollTop / maxScroll;
        }

        targetZ = scrollPercent * maxDepth;
        
        // Start animation loop if not running
        if (!animFrameId) {
            animate();
        }
    }

    function animate() {
        // Linear interpolation (lerp) for smooth scroll damping
        const diff = targetZ - currentZ;
        
        // If difference is extremely small, snap to target and halt loop
        if (Math.abs(diff) < 0.05) {
            currentZ = targetZ;
            animFrameId = null;
        } else {
            currentZ += diff * 0.08; // Smoothness speed (lower = smoother/delayed, higher = faster)
            animFrameId = requestAnimationFrame(animate);
        }

        // Translate the 3D wrapper
        if (wrapper) {
            wrapper.style.transform = `translateZ(${currentZ}px)`;
        }

        // Calculate active index based on current Z position
        const currentPercent = currentZ / maxDepth;
        const activeIndex = Math.min(Math.round(currentPercent * 3), 3);

        sections.forEach((section, index) => {
            const depth = index * 1500;
            const dist = currentZ - depth; // Distance relative to camera (0 is at screen)

            let opacity = 0;
            if (dist >= -1500 && dist <= 0) {
                // Fade in as it approaches
                opacity = (dist + 1500) / 1500;
            } else if (dist > 0 && dist <= 300) {
                // Fade out as it goes past camera
                opacity = 1 - (dist / 300);
            }

            section.style.opacity = opacity;
            
            if (index === activeIndex && dist >= -750 && dist <= 150) {
                section.classList.add("active");
                section.style.pointerEvents = "auto";
            } else {
                section.classList.remove("active");
                section.style.pointerEvents = "none";
            }
        });

        // Update active class in navigation controls
        controls.forEach(button => {
            const targetId = button.dataset.id;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const sectionIndex = parseInt(targetSection.dataset.depth || "0", 10);
                if (sectionIndex === activeIndex) {
                    button.classList.add("active-btn");
                } else {
                    button.classList.remove("active-btn");
                }
            }
        });
    }

    // Scroll listener
    window.addEventListener("scroll", updateScrollPercent);
    window.addEventListener("resize", updateScrollPercent);

    // Initial positioning
    setTimeout(updateScrollPercent, 100);

    // Navigation click scrolling logic
    controls.forEach(button => {
        button.addEventListener("click", function() {
            const targetId = button.dataset.id;
            if (targetId) {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    const sectionIndex = parseInt(targetSection.dataset.depth || "0", 10);
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                    const targetScroll = (sectionIndex / 3) * maxScroll;
                    
                    window.scrollTo({
                        top: targetScroll,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // 2. Light / Dark Theme toggle
    const themeBtn = document.querySelector(".theme-btn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
        });
    }

    // 3. Typing Effect
    const typingElement = document.querySelector(".typing-text");
    if (typingElement) {
        const words = ["student learning coding", "aspiring programmer", "continuous learner"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 1500; // Pause at full word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before next word
            }

            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1000);
    }

    // 4. Contact Form submission logic using SMTP.js
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name = document.getElementById("name") ? document.getElementById("name").value : "";
            const email = document.getElementById("email") ? document.getElementById("email").value : "";
            const subject = document.getElementById("subject") ? document.getElementById("subject").value : "";
            const message = document.getElementById("message") ? document.getElementById("message").value : "";
            const sendButton = document.getElementById("send-button");

            // Disable submit button during email dispatch
            if (sendButton) {
                sendButton.disabled = true;
                const btnText = sendButton.querySelector(".btn-text");
                if (btnText) btnText.textContent = "Sending...";
            }

            // SMTPJS Send Email
            if (window.Email) {
                window.Email.send({
                    SecureToken: "cb79d266-09be-4030-bab2-f4abe92f9825",
                    To: 'pratikpople@gmail.com',
                    From: 'pratikpople@gmail.com',
                    Subject: subject,
                    Body: `Name: ${name}<br>Email: ${email}<br>Message: ${message}`
                }).then(msg => {
                    alert("Message sent successfully!");
                    contactForm.reset();
                }).catch(err => {
                    alert("Failed to send message. Please try again.");
                    console.error(err);
                }).finally(() => {
                    if (sendButton) {
                        sendButton.disabled = false;
                        const btnText = sendButton.querySelector(".btn-text");
                        if (btnText) btnText.textContent = "Send Message";
                    }
                });
            } else {
                alert("Email service is currently unavailable. Please try again later.");
                if (sendButton) {
                    sendButton.disabled = false;
                    const btnText = sendButton.querySelector(".btn-text");
                    if (btnText) btnText.textContent = "Send Message";
                }
            }
        });
    }
})();
