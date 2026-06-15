"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CreateUserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN' | 'SUPERADMIN'>('USER');
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const response = await fetch('/api/superadmin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const json = await response.json();
    if (!response.ok) return setMessage(json.error || 'Gagal membuat user.');
    setMessage(`User ${json.email} berhasil dibuat.`);
    setName(''); setEmail(''); setPassword(''); setRole('USER');
    window.location.reload();
  }

  return (
    <form onSubmit={submit} className='grid gap-4 md:grid-cols-2'>
      <label className='block text-sm font-semibold text-[#0F172A]'>Nama
        <input className='input mt-2' value={name} onChange={(e) => setName(e.target.value)} placeholder='Nama user' />
      </label>
      <label className='block text-sm font-semibold text-[#0F172A]'>Email
        <input className='input mt-2' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='user@email.com' />
      </label>
      <label className='block text-sm font-semibold text-[#0F172A]'>Password
        <input className='input mt-2' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder='Minimal 8 karakter' />
      </label>
      <label className='block text-sm font-semibold text-[#0F172A]'>Role
        <select className='input mt-2' value={role} onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN' | 'SUPERADMIN')}>
          <option value='USER'>USER</option>
          <option value='ADMIN'>ADMIN</option>
          <option value='SUPERADMIN'>SUPERADMIN</option>
        </select>
      </label>
      <div className='md:col-span-2'>
        <Button type='submit'>Tambah User</Button>
        {message ? <p className='mt-3 text-sm font-medium text-[#2563EB]'>{message}</p> : null}
      </div>
    </form>
  );
}
