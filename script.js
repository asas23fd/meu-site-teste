document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('cta-button');
    const message = document.getElementById('message');

    const mensagens = [
        'Olá! Bem-vindo ao site! 👋',
        'Obrigado por clicar! 🎉',
        'Este site está no GitHub Pages! 🌐',
        'HTML + CSS + JS = ❤️',
        'Você clicou! Que surpresa! 😄',
        'Site construído com carinho! 💜',
        'GitHub Pages é incrível! ⭐',
        'Continue explorando! 🚀'
    ];

    let contador = 0;

    button.addEventListener('click', function() {
        message.textContent = mensagens[contador % mensagens.length];
        contador++;

        message.style.opacity = '0';
        setTimeout(function() {
            message.style.transition = 'opacity 0.5s';
            message.style.opacity = '1';
        }, 10);
    });

    // Smooth scroll para links do menu
    document.querySelectorAll('nav a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});