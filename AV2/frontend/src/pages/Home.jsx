import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main id="main-content" style={{ flex: 1 }}>

        {/* ── Hero ── */}
        <section className="hero-section">
          <div className="container hero-inner">
            <h1>Soluções de <em>TI</em> para<br />empresas que querem crescer</h1>
            <p className="hero-tagline">
              Desenvolvimento, segurança, cloud e suporte especializado —
              tudo sob medida para o seu negócio.
            </p>
            <div>
              <Link to="/cadastro" className="btn btn-primary btn-lg">Começar agora</Link>
              &nbsp;
              <a href="#historia" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.4)' }}>
                Conheça a empresa
              </a>
            </div>
          </div>
        </section>

        {/* ── Nossa História ── */}
        <section id="historia" className="section">
          <div className="container">
            <h2>Nossa História</h2>
            <p className="section-lead">
              Fundada em <strong>2015</strong> na cidade de <mark>Recife–PE</mark>, a{' '}
              <strong>ArtWinners TI</strong> nasceu da visão de três profissionais apaixonados por
              tecnologia que identificaram uma lacuna no mercado.
            </p>
            <p style={{ borderLeft: '4px solid var(--brand)', paddingLeft: '1rem', background: 'var(--brand-tint)', borderRadius: '0 var(--radius) var(--radius) 0', padding: '.85rem 1.25rem', fontStyle: 'italic' }}>
              "Nossa missão é democratizar a tecnologia de ponta para empresas de todos os tamanhos,
              tornando a transformação digital acessível, segura e eficiente."
              <em> — Ana Paula Costa, CEO</em>
            </p>
            <p style={{ marginTop: '1rem' }}>
              Ao longo de quase uma <strong>década de operação</strong>, a ArtWinners TI cresceu para
              mais de <strong>60 profissionais certificados</strong>, atendendo mais de 300 clientes
              em todo o Brasil. Em 2019, inauguramos nossa sede no bairro de Afogados com
              central de monitoramento 24×7 e <strong>99,9% de disponibilidade</strong>.
            </p>
          </div>
        </section>

        {/* ── Vídeo Institucional ── */}
        <section id="video" className="section section-alt">
          <div className="container">
            <h2>Vídeo Institucional</h2>
            <p className="section-lead">Conheça nossa estrutura, equipe e como trabalhamos.</p>
            <div className="video-wrapper">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/Gg5UFZYOv-A?si=ddFrH5ZgbrNdH1wJ"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* ── Galeria ── */}
        <section id="galeria" className="section">
          <div className="container">
            <h2>Nossas Instalações</h2>
            <p className="section-lead">Um ambiente moderno, colaborativo e preparado para entregar o melhor em tecnologia.</p>
            <div className="gallery" role="list">
              {[
                { src: '/images/area-desenvolvimento.png',   alt: 'Área de Desenvolvimento',   cap: 'Área de Desenvolvimento' },
                { src: '/images/data-center-artwinners.png', alt: 'Data Center e Infraestrutura', cap: 'Data Center' },
                { src: '/images/Equipe-artwinners.png',      alt: 'Equipe de Desenvolvimento',  cap: 'Nossa Equipe' },
                { src: '/images/sala-treinamento-artwinners.png', alt: 'Sala de Treinamento', cap: 'Sala de Treinamento' },
                { src: '/images/lab-qa-artwinners.png',      alt: 'Laboratório de QA',          cap: 'Laboratório de QA' },
              ].map(img => (
                <figure key={img.src} className="gallery-item" role="listitem">
                  <img src={img.src} alt={img.alt} loading="lazy" />
                  <figcaption>{img.cap}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── Serviços ── */}
        <section id="servicos-home" className="section section-alt">
          <div className="container">
            <h2>Principais Serviços de TI</h2>
            <p className="section-lead">Soluções completas e personalizadas para transformar a tecnologia em vantagem competitiva.</p>
            <table className="servicos-table" aria-label="Serviços de TI disponíveis">
              <tbody>
                <tr>
                  <td><div className="servico-card-inner"><span className="icone">💻</span><h3>Desenvolvimento de Software</h3><p>Sistemas web, mobile e desktop sob medida, com metodologias ágeis.</p></div></td>
                  <td><div className="servico-card-inner"><span className="icone">🛡️</span><h3>Segurança da Informação</h3><p>Auditoria, LGPD, testes de penetração e políticas de segurança corporativa.</p></div></td>
                  <td><div className="servico-card-inner"><span className="icone">☁️</span><h3>Cloud Computing</h3><p>Migração e gerenciamento em AWS, Azure e Google Cloud Platform.</p></div></td>
                </tr>
                <tr>
                  <td><div className="servico-card-inner"><span className="icone">🎮</span><h3>Criação de Jogos</h3><p>Jogos digitais sob medida, do conceito até a implementação.</p></div></td>
                  <td><div className="servico-card-inner"><span className="icone">📊</span><h3>Consultoria em TI</h3><p>Planejamento estratégico e roadmap de transformação digital.</p></div></td>
                  <td><div className="servico-card-inner"><span className="icone">🌐</span><h3>Gestão de Redes</h3><p>Monitoramento proativo, firewall e VPN para ambientes corporativos.</p></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Fundadores ── */}
        <section id="fundadores" className="section">
          <div className="container">
            <h2>Nossos Fundadores</h2>
            <p className="section-lead">Conheça as pessoas que tornam a ArtWinners TI possível.</p>
            <div className="table-scroll">
              <table className="fundadores-table" aria-label="Fundadores da ArtWinners TI">
                <thead>
                  <tr>
                    <th>Cargo</th>
                    <th>Nome</th>
                    <th>Mini Currículo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CEO — Diretora Executiva</td>
                    <td>Ana Paula Costa</td>
                    <td>Bacharel em Sistemas de Informação pela UFPE com MBA em Gestão de Tecnologia. <strong>15 anos</strong> de experiência. Palestrante no <em>TDC</em> e <em>Campus Party NE</em>.</td>
                  </tr>
                  <tr>
                    <td>CTO — Diretor de Tecnologia</td>
                    <td>Carlos Eduardo Lima</td>
                    <td>Engenheiro de Computação pela UNICAP. Certificado <strong>AWS Solutions Architect</strong> e <strong>Microsoft Azure Expert</strong>.</td>
                  </tr>
                  <tr>
                    <td>CFO — Diretora Financeira</td>
                    <td>Marina Santos Ferreira</td>
                    <td>Economista pela UFPE com pós-graduação em <em>Finanças Corporativas</em> e especialização em <strong>Fintech</strong>.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}