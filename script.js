// --- 1. SUBSTITUIÇÃO DO ALERT() ---
// Função para mostrar notificação customizada
function showNotification(message, type = 'success') {
    const modal = document.getElementById('custom-modal');
    if (!modal) return;
    
    modal.textContent = message;
    modal.className = 'custom-modal show'; // Reseta classes e mostra
    
    if (type === 'error') {
        modal.classList.add('error');
    } else {
        modal.classList.add('success');
    }

    // Esconde depois de 3 segundos
    setTimeout(() => {
        modal.classList.remove('show');
    }, 3000);
}

// --- 2. SMOOTH SCROLL ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- 3. CONTADOR DE CARACTERES ---
const textarea = document.getElementById('form-message');
const charCount = document.querySelector('.char-count');

if (textarea && charCount) {
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        const remaining = 250 - length;
        charCount.textContent = `${remaining} caracteres restantes`;
        if (length > 250) {
            this.value = this.value.substring(0, 250);
            charCount.textContent = `0 caracteres restantes`;
        }
    });
}

// --- 4. CARROSSEL DE DEPOIMENTOS ---
const track = document.querySelector('.testimonial-slider-track');
if (track) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const navs = document.querySelectorAll('.carousel-nav');
    let currentIndex = 0;
    const slideCount = testimonials.length > 0 ? testimonials.length : 3; // Evita divisão por zero

    function updateCarousel(index) {
        if (track) {
            // Ajuste para garantir que o carrossel funcione com o width do card
            const slideWidth = testimonials[0].offsetWidth;
            const gap = 30; // 'gap' definido no CSS
            track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;
            
            // Se estiver usando 100% no CSS, use a linha abaixo:
            // track.style.transform = `translateX(-${index * 100}%)`;
        }
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
        });
    });

    navs.forEach(nav => {
        nav.addEventListener('click', () => {
            let newIndex;
            const direction = nav.dataset.direction;
            if (direction === 'prev') {
                newIndex = (currentIndex - 1 + slideCount) % slideCount;
            } else {
                newIndex = (currentIndex + 1) % slideCount;
            }
            updateCarousel(newIndex);
        });
    });

    // Inicia o carrossel no primeiro slide
    updateCarousel(0);
}


// --- 5. VALIDAÇÃO E ENVIO DO FORMULÁRIO (CORRIGIDO COM FETCH) ---

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("volunteer-form");
  const btn = document.querySelector(".btn-submit");
  const charCount = document.querySelector(".char-count");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Estado inicial
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Enviando...`;
    showNotification("Enviando seu cadastro...", "success");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        showNotification("Obrigado por se cadastrar! Entraremos em contato.");
        form.reset();
        if (charCount) charCount.textContent = "Max: 250 Chars";
      } else {
        showNotification("Erro ao enviar o cadastro. Tente novamente.", "error");
      }
    } catch (error) {
      console.error(error);
      showNotification("Erro inesperado. Tente novamente mais tarde.", "error");
    }

    btn.disabled = false;
    btn.textContent = "Cadastre-se";
  });
});


// --- 6. ANIMAÇÃO SUAVE AO SCROLL (Intersection Observer) ---
try {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
} catch(e) {
    console.warn("Intersection Observer não suportado ou falhou:", e);
}