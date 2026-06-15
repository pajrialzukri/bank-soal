import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition active:scale-[0.98]', {
  variants: {
    variant: {
      default: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]',
      secondary: 'bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE]',
      ghost: 'bg-transparent text-[#0F172A] hover:bg-[#EFF6FF]',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
