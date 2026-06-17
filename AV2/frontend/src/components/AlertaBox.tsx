interface AlertaBoxProps {
  mensagem?: string
  tipo?: 'erro' | 'sucesso'
}

export default function AlertaBox({ mensagem, tipo = 'erro' }: AlertaBoxProps) {
  if (!mensagem) return null
  return (
    <div className={`alerta-box ${tipo}`} role="alert">
      {mensagem}
    </div>
  )
}
