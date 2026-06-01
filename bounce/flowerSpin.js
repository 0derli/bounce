const button = document.querySelector('.hero1 a');
const flower = document.getElementById('flower');

button.addEventListener('mouseenter', () => {
    flower.style.animation = 'spin 3s linear infinite';
});

button.addEventListener('mouseleave', () => {
    flower.style.animation = '';
});