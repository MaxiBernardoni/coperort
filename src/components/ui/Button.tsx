import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'rounded-card cursor-pointer text-[15px] font-bold transition'
  const variantClass =
    variant === 'primary'
      ? 'bg-accent px-12 py-3.5 text-[#141414] hover:bg-accent-hover'
      : 'border border-border-strong bg-transparent px-6 py-2.5 text-text hover:border-text-secondary'

  return <button className={`${base} ${variantClass} ${className}`} {...props} />
}
