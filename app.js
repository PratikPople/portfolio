(function () {
    // 1. Navigation controls logic
    const controls = document.querySelectorAll(".control");
    controls.forEach(button => {
        button.addEventListener("click", function() {
            // Remove active-btn from the previous active button
            const activeBtn = document.querySelector(".active-btn");
            if (activeBtn) {
                activeBtn.classList.remove("active-btn");
            }
            this.classList.add("active-btn");

            // Remove active from the previous active section
            const activeSection = document.querySelector(".active");
            if (activeSection) {
                activeSection.classList.remove("active");
            }

            // Find target section and activate it
            const targetId = button.dataset.id;
            if (targetId) {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add("active");
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
