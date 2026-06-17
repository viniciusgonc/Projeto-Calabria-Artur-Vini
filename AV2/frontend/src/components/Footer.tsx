export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-bg" aria-hidden="true"></div>
      <div className="footer-inner">
        <table className="footer-table">
          <tbody>
            <tr>
              <td>
                <h4>Contato</h4>
                <ul>
                  <li>📞 <a href="tel:+558134567890">(81) 3456-7890</a></li>
                  <li>💬 <a href="tel:+5581995801980">(81) 99580-1980 (WhatsApp)</a></li>
                  <li>✉️ <a href="mailto:contato@artwinnersti.com.br">contato@artwinnersti.com.br</a></li>
                </ul>
              </td>
              <td>
                <h4>Endereço</h4>
                <address className="footer-address">
                  Rua Padre Euclides Jardim, 248<br />
                  Bairro Afogados — Recife, PE<br />
                  CEP: 50.750-090<br />
                  <br />
                  <strong>Horário:</strong> Seg–Sex, 08h–18h
                </address>
              </td>
              <td>
                <h4>Formas de Pagamento</h4>
                <div className="footer-payment">
                  <span className="payment-badge">💳 Cartão de Crédito</span>
                  <span className="payment-badge">🔑 Pix</span>
                  <span className="payment-badge">📄 Boleto</span>
                  <span className="payment-badge">🏦 Transferência</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="footer-copy">
          © {ano} ArtWinners TI — Todos os direitos reservados. CNPJ 00.000.000/0001-00
        </p>
      </div>
    </footer>
  );
}