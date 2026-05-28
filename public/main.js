// =========================================================
// === 1. VARIÁVEIS E CONFIGURAÇÕES GERAIS               ===
// =========================================================

function toggleProfileDropdown() {
    const dropdown = document.getElementById("profileDropdownContent");
    if (dropdown) dropdown.classList.toggle("show");
}

document.addEventListener('click', (event) => {
    const container = document.querySelector('.dropdown-profile');
    const content = document.getElementById("profileDropdownContent");
    if (container && content && content.classList.contains('show')) {
        if (!container.contains(event.target)) content.classList.remove('show');
    }
});

// =========================================================
// === 2. INICIALIZAÇÃO DO DOM (TUDO RODA AQUI DENTRO)   ===
// =========================================================
document.addEventListener('DOMContentLoaded', function() {
    
    const cadastroForm = document.getElementById('cadastroForm');
    const loginForm = document.getElementById('loginForm');
    const listaEventos = document.querySelector('.events-list');
    
    const modalCriar = document.getElementById('modalCriarEvento');
    const modalEditar = document.getElementById('modalEditarEvento');
    const modalPerfil = document.getElementById('modalPerfil');

    // --- CADASTRO ---
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dados = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                senha: document.getElementById('senha').value
            };
            try {
                const res = await fetch('http://localhost:3000/usuarios', {
                    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(dados)
                });
                const json = await res.json();
                if (res.status === 201) { alert('Cadastro OK! Faça login.'); cadastroForm.reset(); }
                else { alert(`Erro: ${json.error}`); }
            } catch (err) { console.error(err); }
        });
    }

    // --- LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dados = {
                email: document.getElementById('loginEmail').value,
                senha: document.getElementById('loginSenha').value
            };
            try {
                const res = await fetch('http://localhost:3000/usuarios/login', {
                    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(dados)
                });
                const json = await res.json();
                if (res.ok) {
                    localStorage.setItem('userId', json.usuario.id_usuario);
                    alert('Login realizado!');
                    window.location.href = '/pos-login.html';
                } else { alert('Dados inválidos.'); }
            } catch (err) { console.error(err); }
        });
    }

    // --- CARREGAMENTO DE EVENTOS ---
    if (listaEventos) {
        carregarEventosDoBanco();
        setInterval(() => {
            const m1 = modalCriar?.classList.contains('mostrar');
            const m2 = modalEditar?.classList.contains('mostrar');
            const m3 = modalPerfil?.classList.contains('mostrar');
            if (!m1 && !m2 && !m3) carregarEventosDoBanco();
        }, 3000);
    }

    async function carregarEventosDoBanco() {
        try {
            const res = await fetch('http://localhost:3000/eventos');
            const eventos = await res.json();
            listaEventos.innerHTML = '';
            eventos.forEach(adicionarNaListaVisual);
        } catch (err) { console.error(err); }
    }

    function adicionarNaListaVisual(evento) {
        let dataF = evento.data_evento;
        if(dataF && dataF.includes('-')) {
            const p = dataF.split('T')[0].split('-'); dataF = `${p[2]}/${p[1]}/${p[0]}`;
        }
        const nomeEx = evento.titulo || evento.nome || "Evento";
        
        // Garante que a hora exista ou coloca padrão
        const horaEx = evento.hora_evento || evento.hora || "00:00";

        const meuId = String(localStorage.getItem('userId'));
        const donoId = String(evento.id_organizador);
        const evtStr = JSON.stringify(evento).replace(/"/g, '&quot;');

        let botoes = '';
        let botoesBaixo = '';

        if (meuId && donoId && meuId !== "null" && donoId !== "undefined" && meuId === donoId) {
            // DONO
            botoes = `<div style="display: flex; gap: 5px;">
                        <button class="btn-editar" onclick="prepararEdicao(${evtStr})">EDITAR</button>
                        <button class="btn-excluir" onclick="confirmarExclusao(${evento.id_evento})">EXCLUIR</button>
                      </div>`;
            botoesBaixo = `<p style="text-align:center; font-size:8px; color:#666; margin-top:10px;">(ORGANIZADOR)</p>`;
        } else {
            // VISITANTE
            botoesBaixo = `<div class="action-buttons">
                            <button onclick="inscreverEvento(${evento.id_evento})" class="btn-circle btn-check">✔</button>
                            <button onclick="recusarEvento(${evento.id_evento})" class="btn-circle btn-cancel">✖</button>
                           </div>`;
        }

        // --- AQUI ESTAVA FALTANDO A HORA NA VERSÃO ANTERIOR ---
        const html = `
            <div class="event-item" id="evento-${evento.id_evento}">
                <div style="display: flex; justify-content: space-between;">
                    <p style="line-height: 2;">
                        DATA: ${dataF} - ${nomeEx}<br>
                        Local: ${evento.local}<br>
                        Início: ${horaEx}; Vagas: ${evento.vagas} | R$ ${evento.valor}
                    </p>
                    ${botoes}
                </div>
                ${botoesBaixo}
                <div class="dashed-line"></div>
            </div>`;
        listaEventos.insertAdjacentHTML('afterbegin', html);
    }

    // --- MODAL DE PERFIL (SALVAR) ---
    const formPerfil = document.getElementById('formEditarPerfil');
    if (formPerfil) {
        formPerfil.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idUser = localStorage.getItem('userId');
            const nome = document.getElementById('perfilNome').value;
            const email = document.getElementById('perfilEmail').value;
            const senha = document.getElementById('perfilSenhaConfirmacao').value;

            try {
                const res = await fetch(`http://localhost:3000/usuarios/${idUser}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senhaConfirmacao: senha })
                });
                const json = await res.json();
                if (res.ok) {
                    alert("✅ " + json.message);
                    if(modalPerfil) modalPerfil.classList.remove('mostrar');
                } else {
                    alert("❌ " + (json.error || "Erro ao atualizar"));
                }
            } catch (err) { console.error(err); alert("Erro de conexão"); }
        });
    }

    // --- SALVAR NOVO EVENTO ---
    const formNovo = document.getElementById('formNovoEvento');
    if(formNovo) {
        formNovo.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idUser = localStorage.getItem('userId');
            if(!idUser) return alert("Logue novamente");
            
            const dados = {
                titulo: document.getElementById('nomeEvento').value,
                data_evento: document.getElementById('dataEvento').value,
                hora_evento: document.getElementById('horaEvento').value,
                local: document.getElementById('localEvento').value,
                vagas: document.getElementById('vagasEvento').value,
                valor: document.getElementById('valorEvento').value.replace(',', '.'),
                id_organizador: idUser
            };
            
            try {
                await fetch('http://localhost:3000/eventos', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(dados)});
                alert("Criado!"); formNovo.reset(); modalCriar.classList.remove('mostrar'); carregarEventosDoBanco();
            } catch(err){console.error(err);}
        });
    }

    // --- SALVAR EDIÇÃO EVENTO (CORRIGIDO) ---
    const formEdit = document.getElementById('formEditarEvento');
    if(formEdit) {
        formEdit.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editIdEvento').value;
            
            // Garante que estamos pegando os valores dos inputs de EDIÇÃO
            const dados = {
                titulo: document.getElementById('editNome').value,
                data_evento: document.getElementById('editData').value,
                hora_evento: document.getElementById('editHora').value,
                local: document.getElementById('editLocal').value,
                vagas: document.getElementById('editVagas').value,
                valor: document.getElementById('editValor').value.replace(',', '.'),
                // Organizador não muda na edição, mas o banco pode pedir validação se quiser
            };

             try {
                const res = await fetch(`http://localhost:3000/eventos/${id}`, {
                    method:'PUT', 
                    headers:{'Content-Type':'application/json'}, 
                    body:JSON.stringify(dados)
                });
                
                if(res.ok) {
                    alert("Atualizado!"); 
                    modalEditar.classList.remove('mostrar'); 
                    carregarEventosDoBanco();
                } else {
                    alert("Erro ao atualizar no servidor.");
                }
            } catch(err){console.error(err);}
        });
    }

    // --- FECHAR MODAIS ---
    window.onclick = (e) => {
        if (e.target == modalCriar) modalCriar.classList.remove('mostrar');
        if (e.target == modalEditar) modalEditar.classList.remove('mostrar');
        if (e.target == modalPerfil) modalPerfil.classList.remove('mostrar');
    }
    
    const btnAbrir = document.getElementById('btnAbrirModal');
    if(btnAbrir) btnAbrir.onclick = (e) => { e.preventDefault(); modalCriar.classList.add('mostrar'); };

}); 

// =========================================================
// === 3. FUNÇÕES GLOBAIS (Chamadas pelo HTML)           ===
// =========================================================

window.abrirModalPerfil = async function(e) {
    if(e) e.preventDefault();
    const idUser = localStorage.getItem('userId');
    if (!idUser) return alert("Não logado");

    const modal = document.getElementById('modalPerfil');
    if(!modal) return;

    try {
        const res = await fetch(`http://localhost:3000/usuarios/${idUser}`);
        if(res.ok) {
            const dados = await res.json();
            document.getElementById('perfilNome').value = dados.nome;
            document.getElementById('perfilEmail').value = dados.email;
            document.getElementById('perfilSenhaConfirmacao').value = "";
            modal.classList.add('mostrar');
            document.getElementById("profileDropdownContent")?.classList.remove("show");
        }
    } catch(err) { console.error(err); }
}

window.fecharModalPerfil = () => document.getElementById('modalPerfil')?.classList.remove('mostrar');
window.fecharModal = () => document.getElementById('modalCriarEvento')?.classList.remove('mostrar');
window.fecharModalEditar = () => document.getElementById('modalEditarEvento')?.classList.remove('mostrar');

window.fazerLogout = function() {
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

window.inscreverEvento = async function(id) {
    const userId = localStorage.getItem('userId');
    if(!userId) return alert("Faça login!");
    try {
        const res = await fetch('http://localhost:3000/inscricoes', {
            method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id_usuario:userId, id_evento:id})
        });
        const json = await res.json();
        if(res.ok) { 
            alert("✅ " + json.message); 
            document.getElementById(`evento-${id}`).style.border = "3px solid #00cc00";
        } else { alert("⚠️ " + json.error); }
    } catch(err){ console.error(err); }
}

window.recusarEvento = async function(id) {
    const userId = localStorage.getItem('userId');
    if(!userId) return alert("Faça login!");
    if(confirm("Cancelar inscrição?")) {
        try {
            const res = await fetch(`http://localhost:3000/inscricoes/${id}/${userId}`, { method:'DELETE' });
            if(res.ok) { alert("Cancelado!"); document.getElementById(`evento-${id}`).style.border = "none"; }
            else { alert("Erro ao cancelar."); }
        } catch(err){ console.error(err); }
    }
}

window.confirmarExclusao = async function(id) {
    if(confirm("Excluir evento para sempre?")) {
        await fetch(`http://localhost:3000/eventos/${id}`, { method:'DELETE' });
        alert("Excluído!");
    }
}

// --- PREPARAR EDIÇÃO (PREENCHE O MODAL) ---
window.prepararEdicao = function(evento) {
    document.getElementById('editIdEvento').value = evento.id_evento;
    document.getElementById('editNome').value = evento.titulo;
    document.getElementById('editData').value = evento.data_evento.split('T')[0];
    document.getElementById('editHora').value = evento.hora_evento;
    document.getElementById('editLocal').value = evento.local;
    document.getElementById('editVagas').value = evento.vagas;
    document.getElementById('editValor').value = evento.valor;
    
    document.getElementById('modalEditarEvento').classList.add('mostrar');
}