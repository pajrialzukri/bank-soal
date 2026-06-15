"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) return setError("Email atau password salah.");
    router.push("/");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2563EB]">
        Yuk Kita Bisa PNS
      </p>
      <h1 className="mt-3 text-3xl font-bold text-[#0F172A]">Masuk ke akun</h1>
      <p className="mt-2 text-[#64748B]">
        Gunakan akun yang dibuat superadmin agar progres latihan personal
        tersimpan.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-[#0F172A]">
          Email
          <input
            className="input mt-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email"
            required
          />
        </label>
        <label className="block text-sm font-semibold text-[#0F172A]">
          Password
          <input
            className="input mt-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
          />
        </label>
        {error ? (
          <p className="rounded-2xl bg-red-50 p-3 text-sm text-[#EF4444]">
            {error}
          </p>
        ) : null}
        <Button className="w-full" disabled={loading}>
          {loading ? "Memproses..." : "Login"}
        </Button>
      </form>
    </Card>
  );
}
