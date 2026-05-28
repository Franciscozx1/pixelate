// =========================================================
// === HOME PAGE - LÓGICA VISUAL E COMPORTAMENTO         ===
// =========================================================

// 1. Dropdown do Perfil
function toggleProfileDropdown() {
    const dropdown = document.getElementById("profileDropdownContent");
    if (dropdown) dropdown.classList.toggle("show");
}

// Fechar o dropdown ao clicar fora
document.addEventListener('click', (event) => {
    const container = document.querySelector('.dropdown-profile');
    const content = document.getElementById("profileDropdownContent");
    if (container && content && content.classList.contains('show')) {
        if (!container.contains(event.target)) {
            content.classList.remove('show');
        }
    }
});

// 2. Lógica Básica do Carrossel (Apenas Estrutura Inicial)
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const btnLeft = document.querySelector('.left-btn');
    const btnRight = document.querySelector('.right-btn');

    if (track && btnLeft && btnRight) {
        // Lógica simples de clique apenas para prever a animação
        btnRight.addEventListener('click', () => {
            console.log("Mover carrossel para a direita");
            // Futuramente: track.style.transform = `translateX(-100%)`;
        });

        btnLeft.addEventListener('click', () => {
            console.log("Mover carrossel para a esquerda");
            // Futuramente: track.style.transform = `translateX(0)`;
        });
    }
});

// 3. Função de Logout Simples
window.fazerLogout = function() {
    localStorage.removeItem('userId');
    alert("Logout efetuado!");
    window.location.reload();
}
// ---------------- CARROSSEL ------------------------------------------------------------------------------------------------------------

let carrosselIndex = 0;
let totalCardsCarrossel = 0;
let carrosselIntervalo;

async function carregarCarrossel() {
    try {
        const res = await fetch('http://localhost:3000/eventos/destaques');
        const eventos = await res.json();
        
        if (eventos && eventos.length > 0) {
            // Pega apenas os 3 primeiros eventos (depois você pode criar a lógica de ordenar por "visitas")
            const top3 = eventos.slice(0, 3);
            totalCardsCarrossel = top3.length;
            
            const track = document.getElementById('carouselTrack');
            track.innerHTML = ''; // Limpa a trilha
            
            top3.forEach((evento) => {
                let dataF = evento.data_evento;
                if(dataF && dataF.includes('-')) {
                    const p = dataF.split('T')[0].split('-'); 
                    dataF = `${p[2]}/${p[1]}/${p[0]}`;
                }

                const titulo = evento.titulo || evento.nome || "Evento";
                const desc = evento.descricao || "Participe deste evento incrível na plataforma Pixelate!";
                const local = evento.local || "A definir";
                // Imagem padrão caso o evento não tenha imagem cadastrada
                const imagemUrl = evento.imagem || './assets/bgs-banner.jpg'; 

                const cardHTML = `
                    <div class="event-card" style="background-image: url('${imagemUrl}')">
                        <div class="card-info">
                            <h4>${titulo}</h4>
                            <p>${desc}</p>
                            <div class="card-footer">
                                <span>Data: ${dataF}</span>
                                <span>Local: ${local}</span>
                            </div>
                        </div>
                    </div>
                `;
                track.innerHTML += cardHTML;
            });
            
            // Inicia o giro automático
            iniciarCarrosselAutomatico();
        }
    } catch (err) { 
        console.error("Erro ao carregar o carrossel:", err); 
    }
}

function moverCarrossel(direcao) {
    if (totalCardsCarrossel === 0) return;
    
    // Atualiza o index baseado na direção (+1 para direita, -1 para esquerda)
    carrosselIndex = (carrosselIndex + direcao + totalCardsCarrossel) % totalCardsCarrossel;
    
    // Move a trilha visualmente
    const track = document.getElementById('carouselTrack');
    if (track) {
        track.style.transform = `translateX(-${carrosselIndex * 100}%)`;
    }
    
    // Reseta o temporizador para não girar duas vezes seguidas se o usuário acabou de clicar
    iniciarCarrosselAutomatico();
}

function iniciarCarrosselAutomatico() {
    clearInterval(carrosselIntervalo);
    // Gira sozinho a cada 5 segundos (5000ms)
    carrosselIntervalo = setInterval(() => moverCarrossel(1), 5000);
}

// Quando a página carregar, puxa os eventos
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrossel();
});