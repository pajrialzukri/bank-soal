import * as React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-3xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-[0_20px_60px_-24px_rgba(37,99,235,0.24)]', className)} {...props} />;
}
