
document.addEventListener('DOMContentLoaded', () => {
    const gb1 = document.getElementById('gb1');
    const gb2 = document.getElementById('gb2');
    
    if (!gb1 && !gb2) return;
    
    function updateSpinningParallax() {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = scrollY / maxScroll; 

        if (gb1) {
            const rotation1 = scrollY * 0.2;
            const moveY1 = scrollY * 0.2;
            gb1.style.transform = `translate3d(0, ${moveY1}px, 0) rotate(${rotation1}deg)`;
        }
        if (gb2) {
            const rotation2 = scrollY * -0.15;
            const moveY2 = scrollY * 0.4;
            gb2.style.transform = `translate3d(0, ${moveY2}px, 0) rotate(${rotation2}deg)`;
        }
        
        requestAnimationFrame(updateSpinningParallax);
    }
    
    updateSpinningParallax();
});

