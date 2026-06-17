import { useState, ChangeEvent } from 'react'

const IconeOlho = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"/>
    <circle cx="12" cy="12" r="3.2"/>
  </svg>
)

const IconeOlhoFechado = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <line x1="3" y1="3" x2="21" y2="21"/>
    <path d="M10.6 6.3A10.9 10.9 0 0 1 12 6c7 0 10.5 6 10.5 6a18.8 18.8 0 0 1-4.2 4.9"/>
    <path d="M6.7 6.7A18.2 18.2 0 0 0 1.5 12s3.5 7 10.5 7c1.9 0 3.6-.4 5.1-1.1"/>
    <path d="M9.9 9.9A3 3 0 0 0 9 12a3 3 0 0 0 4.6 2.6"/>
  </svg>
)

interface SenhaInputProps {
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  autoComplete?: string
  erro?: string
}

export default function SenhaInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete = 'current-password',
  erro,
}: SenhaInputProps) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className="senha-wrapper">
      <input
        type={visivel ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Digite sua senha'}
        autoComplete={autoComplete}
        maxLength={64}
        className={erro ? 'campo-erro' : ''}
      />
      <button
        type="button"
        className={`btn-toggle-senha${visivel ? ' ativo' : ''}`}
        onClick={() => setVisivel(v => !v)}
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        title={visivel ? 'Ocultar senha' : 'Mostrar senha'}>
        {visivel ? <IconeOlhoFechado /> : <IconeOlho />}
      </button>
      {erro && <span className="msg-erro">{erro}</span>}
    </div>
  )
}
