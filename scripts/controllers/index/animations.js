/* --- REATORAÇÃO DE ANIMAÇÕES DO BLOG --- */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ANIMAÇÕES IMEDIATAS (Header e Hero)
    const immediateElements = {
        '.header': 'reveal-header',
        '.hero-text': 'reveal-hero-text',
        '.hero-image': 'reveal-hero-img'
    };

    Object.entries(immediateElements).forEach(([selector, className], index) => {
        const el = document.querySelector(selector);
        if (el) setTimeout(() => el.classList.add(className), index * 200);
    });

    // 2. INTERSECTION OBSERVER GENÉRICO (Scroll Animation)
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;

                // Lógica de Stagger (atraso sequencial) para os Cards
                if (el.classList.contains('card')) {
                    const gridIndex = Array.from(el.parentNode.children).indexOf(el);
                    el.style.animationDelay = `${(gridIndex % 3) * 0.15}s`;
                }

                // Define qual classe de revelação usar baseada no elemento
                const revealClass = el.classList.contains('author-profile__card') ? 'author-profile__card--visible' :
                                    el.classList.contains('main-footer') ? 'reveal-footer' : 'reveal-up';

                el.classList.add(revealClass);
                scrollObserver.unobserve(el);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    // Seleciona todos os elementos que devem ser observados no scroll
    document.querySelectorAll('.card, .load-more, .author-profile__card, .main-footer')
            .forEach(el => scrollObserver.observe(el));

    // 3. FEEDBACK DE CLIQUE NO BOTÃO DO AUTOR
    const ctaButton = document.getElementById('author-cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const originalText = ctaButton.textContent;
            ctaButton.textContent = "Carregando...";
            ctaButton.style.opacity = "0.8";
            
            setTimeout(() => {
                console.log("Navegando para página completa do autor...");
								window.location.href = "sobre.html";
                ctaButton.textContent = originalText;
                ctaButton.style.opacity = "1";
            }, 800);
        });
    }
});