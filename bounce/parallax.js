
document.addEventListener('DOMContentLoaded', function() {

    const discountSection = document.querySelector('.discountSec');
    if (!discountSection) return;

    const ticketBack = document.getElementById('ticketBack');     
    const ticketFront = document.querySelector('.ticketFront');   
    const decorDepth = document.getElementById('decorDepth');
    const decorOranje = document.getElementById('decorOranje');
    const decorSticker = document.getElementById('decorSticker');
    const decorText = document.getElementById('decorText');

    function updateParallax() {
        const rect = discountSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        let progress = 0;
        if (rect.top < windowHeight && rect.bottom > 0) {
            const visibleStart = Math.max(0, windowHeight - rect.bottom);
            const visibleEnd = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
            const totalVisible = rect.height;
            const scrollPercent = (window.scrollY - (rect.top + window.scrollY - rect.top)) / rect.height;
            progress = Math.min(1, Math.max(0, (window.scrollY - (rect.top + window.scrollY - rect.top)) / rect.height));
        }

        const sectionTop = discountSection.offsetTop;
        const sectionHeight = discountSection.offsetHeight;
        const scrollY = window.scrollY;
        let scrollProgress = 0;
        
        if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
            scrollProgress = (scrollY + windowHeight/2 - sectionTop) / sectionHeight;
            scrollProgress = Math.min(0.8, Math.max(-0.8, scrollProgress - 0.4));
        } else if (scrollY + windowHeight <= sectionTop) {
            scrollProgress = -0.4;
        } else if (scrollY >= sectionTop + sectionHeight) {
            scrollProgress = 0.4;
        } else {
            scrollProgress = (scrollY - sectionTop) / sectionHeight - 0.3;
            scrollProgress = Math.min(0.6, Math.max(-0.6, scrollProgress));
        }
        
        
        if (ticketBack) {
            const moveY = scrollProgress * 35;  
            ticketBack.style.transform = `translateY(${moveY}px)`;
        }
        
        if (ticketFront) {
            const moveY = scrollProgress * 85; 
            ticketFront.style.transform = `translateY(${moveY}px)`;
        }

        if (decorDepth) {
            const moveY = scrollProgress * 120;
            const moveX = scrollProgress * 25;
            decorDepth.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
        
        if (decorOranje) {
            const moveY = scrollProgress * 140;
            const moveX = scrollProgress * -35;
            decorOranje.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${scrollProgress * 15}deg)`;
        }
        
        if (decorSticker) {
            const moveY = scrollProgress * 100;
            const moveX = scrollProgress * 45;
            decorSticker.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${scrollProgress * -20}deg)`;
        }
        
        if (decorText) {
            const moveY = scrollProgress * 95;
            decorText.style.transform = `translateY(${moveY}px) rotate(-6.86deg)`;
        }
    }

    window.addEventListener('scroll', updateParallax);
    window.addEventListener('resize', updateParallax);
    updateParallax();

    setTimeout(updateParallax, 100);
});