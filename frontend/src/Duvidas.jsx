import { useState } from 'react'
import './Duvidas.css'
import Navbar from './Navbar'

const faqs = [
  {
    categoria: 'Participantes',
    itens: [
      {
        pergunta: 'Como me cadastro na plataforma?',
        resposta: 'Clique em "Cadastro" na navbar, preencha seu nome, e-mail e senha e clique em "Criar conta". Após o cadastro, faça login para acessar todas as funcionalidades.'
      },
      {
        pergunta: 'Como me inscrevo em um evento?',
        resposta: 'Na página de Eventos, clique no evento desejado para abrir os detalhes. Com login feito, o botão "Inscrever-se" estará disponível. Clique nele para confirmar sua inscrição.'
      },
      {
        pergunta: 'Como cancelo minha inscrição?',
        resposta: 'No momento, o cancelamento de inscrição deve ser solicitado diretamente ao organizador do evento. Em breve essa funcionalidade estará disponível na plataforma.'
      },
      {
        pergunta: 'Como avalio um evento?',
        resposta: 'Após participar de um evento, acesse-o na página de Eventos, abra os detalhes e role até a seção de Avaliações. Selecione uma nota de 1 a 5 estrelas, adicione um comentário opcional e envie.'
      }
    ]
  },
  {
    categoria: 'Organizadores',
    itens: [
      {
        pergunta: 'Como crio um evento?',
        resposta: 'Com login feito, acesse a página "Criar" pela navbar. Preencha os dados do evento — título, descrição, data, horário, local, vagas, valor e categoria — e publique.'
      },
      {
        pergunta: 'Como edito ou cancelo um evento?',
        resposta: 'Acesse seu perfil e localize o evento que deseja editar. As opções de edição e cancelamento estarão disponíveis diretamente na listagem dos seus eventos criados.'
      },
      {
        pergunta: 'Como vejo quem se inscreveu no meu evento?',
        resposta: 'No painel do organizador, disponível no seu perfil, você pode visualizar a lista de participantes inscritos em cada evento que criou.'
      }
    ]
  },
  {
    categoria: 'Geral',
    itens: [
      {
        pergunta: 'A plataforma é gratuita?',
        resposta: 'Sim. O acesso ao Pixelate é gratuito tanto para participantes quanto para organizadores. Eventos pagos podem ter valor de ingresso definido pelo próprio organizador.'
      },
      {
        pergunta: 'Como entro em contato com o suporte?',
        resposta: 'Por enquanto, o suporte é realizado diretamente pelos desenvolvedores do projeto. Em caso de dúvidas não respondidas aqui, entre em contato pelo e-mail do projeto.'
      }
    ]
  }
]

function Item({ pergunta, resposta }) {
  const [aberto, setAberto] = useState(false)
  return (
    <div className={`faq-item ${aberto ? 'aberto' : ''}`}>
      <button className="faq-pergunta" onClick={() => setAberto(a => !a)}>
        <span>{pergunta}</span>
        <span className="faq-icone">{aberto ? '−' : '+'}</span>
      </button>
      {aberto && <p className="faq-resposta">{resposta}</p>}
    </div>
  )
}

export default function Duvidas() {
  return (
    <div className="duvidas-page">
      <Navbar />
      <div className='div-nav-container'>

      </div>
      <div className="duvidas-hero">
        <h1 className="duvidas-titulo">Dúvidas Frequentes</h1>
        <p className="duvidas-sub">Encontre respostas para as perguntas mais comuns sobre o Pixelate.</p>
      </div>

      <div className="duvidas-conteudo">
        {faqs.map(grupo => (
          <div key={grupo.categoria} className="faq-grupo">
            <h2 className="faq-categoria">{grupo.categoria}</h2>
            {grupo.itens.map(item => (
              <Item key={item.pergunta} {...item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
