document.addEventListener('DOMContentLoaded', () => {
    const num1 = document.getElementById('num1');
    const num2 = document.getElementById('num2');
    const num3 = document.getElementById('num3');
    
    const targets = [
        { element: num1, value: 15, isPercent: false },
        { element: num2, value: 100, isPercent: true },
        { element: num3, value: 0, isPercent: true }
    ];
    
    function animateNumber(element, targetValue, isPercent, duration = 2000) {
        let start = 0;
        const increment = targetValue / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                element.textContent = isPercent ? targetValue + '%' : targetValue;
                clearInterval(timer);
            } else {
                element.textContent = isPercent ? Math.floor(current) + '%' : Math.floor(current);
            }
        }, 16);
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = targets.find(t => t.element === entry.target);
                if (target) {
                    animateNumber(target.element, target.value, target.isPercent);
                    observer.unobserve(entry.target);
                }
            }
        });
    });
    
    targets.forEach(target => {
        if (target.element) {
            const originalText = target.element.textContent;
            target.element.textContent = target.isPercent ? '0%' : '0';
            observer.observe(target.element);
        }
    });
});