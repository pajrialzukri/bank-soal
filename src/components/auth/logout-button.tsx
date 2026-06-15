"use client";

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  return (
    <Button type='button' variant='secondary' onClick={() => signOut({ callbackUrl: '/login' })} className='w-full justify-center'>
      <LogOut className='mr-2 h-4 w-4' /> Logout
    </Button>
  );
}
