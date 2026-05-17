import { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15 ${className}`} {...props} />;
}
