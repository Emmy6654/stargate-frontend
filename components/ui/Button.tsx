import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

export function Button({ className = '', variant = 'default', ...props }: ButtonProps) {
  const baseStyles = 'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60';
  
  const variants = {
    default: 'bg-violet text-white hover:bg-ocean',
    outline: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50',
    ghost: 'text-slate-700 hover:bg-slate-100',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  const variantClass = variant === 'secondary'
    ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
    : 'bg-violet hover:bg-ocean text-white';
  
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClass} ${className}`}
      {...props}
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  asChild?: boolean;
  children?: ReactNode;
}

export function Button({ className = '', variant = 'primary', asChild = false, ...props }: ButtonProps) {
  const baseStyles = 'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition';
  const variantStyles = variant === 'primary' 
    ? 'bg-violet text-white hover:bg-ocean disabled:cursor-not-allowed disabled:opacity-60'
    : 'bg-slate-100 text-ink hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60';
  
  const Element = asChild ? 'a' : 'button';
  
  return (
    <Element
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...(asChild ? {} : props)}
      {...(asChild ? props : {})}
    />
  );
}
