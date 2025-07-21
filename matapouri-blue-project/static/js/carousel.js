// Image Carousel Functionality
class ImageCarousel {
    constructor() {
        this.images = [
            '/static/images/3_lake_1752487455279.jpeg',
            '/static/images/Whang stream_1752715224981.jpeg',
            '/static/images/0_Blue_1752487455279.jpeg',
            '/static/images/1_Zen_1752487455279.jpeg',
            '/static/images/2_studio_1752487455279.jpeg',
            '/static/images/4_bridge_1752487455279.jpeg',
            '/static/images/Garden_1752715224980.jpeg',
            '/static/images/Spooky Forrest_1752715224981.jpeg',
            '/static/images/IMG_9564_1752715224981.jpeg',
            '/static/images/IMG_9553_1752715224981.jpeg',
            '/static/images/Lounge studio_1752715224981.jpeg',
            '/static/images/Blue heron_1752719468329.jpeg'
        ];
        this.currentIndex = 0;
        this.interval = 10000; // 10 seconds
        this.container = null;
        this.imageElements = [];
        this.timer = null;
    }

    init() {
        this.container = document.getElementById('carousel-container');
        if (!this.container) return;

        this.createImageElements();
        this.startCarousel();
        this.addEventListeners();
    }

    createImageElements() {
        this.images.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `Matapouri Blue Image ${index + 1}`;
            img.className = 'carousel-image';
            img.loading = 'lazy';
            
            // Add error handling for missing images
            img.onerror = () => {
                console.warn(`Image not found: ${imageSrc}`);
                img.style.background = 'linear-gradient(135deg, #87CEEB, #ADD8E6)';
                img.style.display = 'flex';
                img.style.alignItems = 'center';
                img.style.justifyContent = 'center';
                img.innerHTML = '<span style="color: rgba(255,255,255,0.7); font-size: 1.2rem;">Image Loading...</span>';
            };

            if (index === 0) {
                img.classList.add('active');
            }

            this.container.appendChild(img);
            this.imageElements.push(img);
        });
    }

    nextImage() {
        // Fade out current image
        this.imageElements[this.currentIndex].classList.remove('active');
        
        // Move to next image
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        
        // Fade in new image
        setTimeout(() => {
            this.imageElements[this.currentIndex].classList.add('active');
        }, 100);
    }

    startCarousel() {
        this.timer = setInterval(() => {
            this.nextImage();
        }, this.interval);
    }

    stopCarousel() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    addEventListeners() {
        // Click to advance to next image
        this.container.addEventListener('click', () => {
            this.stopCarousel();
            this.nextImage();
            this.startCarousel();
        });

        // Pause carousel on hover
        this.container.addEventListener('mouseenter', () => {
            this.stopCarousel();
        });

        // Resume carousel when mouse leaves
        this.container.addEventListener('mouseleave', () => {
            this.startCarousel();
        });

        // Handle visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopCarousel();
            } else {
                this.startCarousel();
            }
        });
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new ImageCarousel();
    carousel.init();
});

// Page animation utilities
function addPageAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all content cards
    document.querySelectorAll('.content-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', addPageAnimations);

// Parallax scrolling effect removed - philosophy section now has static positioning

// Welcome section - map functionality moved to Discover page
function initWelcomeMapSection() {
    // Map functionality has been moved to the dedicated Discover page
    // This function is now simplified for the front page
    console.log('Welcome section initialized - map functionality moved to Discover page');
    
    // Parallax effect removed - welcome section now has static positioning
    
    // Map initialization is handled by kinloch-map.js
}

// Initialize welcome section
document.addEventListener('DOMContentLoaded', initWelcomeMapSection);
