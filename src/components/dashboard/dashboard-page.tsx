import {
  BookOpen,
  Brain,
  CheckCircle2,
  Flame,
  Target,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { AppShell } from "@/components/layout/app-shell";
import { getDashboardStats } from "@/lib/dashboard";
import { requireUser } from "@/lib/session";

export async function DashboardPage() {
  await requireUser();
  const stats = await getDashboardStats();

  const items = [
    { label: "Total Soal Dikerjakan", value: stats.totalAnswered, icon: Brain },
    { label: "Jumlah Benar", value: stats.correct, icon: CheckCircle2 },
    { label: "Jumlah Salah", value: stats.wrong, icon: XCircle },
    { label: "Akurasi", value: `${stats.accuracy}%`, icon: Target },
    { label: "Streak Belajar", value: `${stats.streak} hari`, icon: Flame },
    { label: "Materi Tersedia", value: stats.materials, icon: BookOpen },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="rounded-[32px] bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] p-8 text-white shadow-[0_24px_60px_-24px_rgba(37,99,235,0.55)]">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-blue-100/90">
            Dashboard User
          </p>
          <h1 className="text-3xl font-bold">
            Siap taklukkan SKD bersama Yuk Kita Bisa PNS
          </h1>
          <p className="mt-3 max-w-3xl text-blue-50">
            Pantau progres belajar, kerjakan latihan TWK/TIU/TKP, dan gunakan AI
            generator untuk mempercepat pengisian bank soal.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#64748B]">{item.label}</p>
                    <p className="mt-3 text-3xl font-bold">{item.value}</p>
                  </div>
                  <div className="rounded-2xl bg-[#EFF6FF] p-3 text-[#2563EB]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <h2 className="text-xl font-semibold">Progress kategori</h2>
            <div className="mt-6 space-y-5">
              {Object.entries(stats.progress).map(([key, value]) => (
                <div key={key}>
                  <div className="mb-2 flex justify-between text-sm text-[#64748B]">
                    <span>{key}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#E2E8F0]">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6]"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">
              Rekomendasi belajar hari ini
            </h2>
            <p className="mt-4 leading-7 text-[#64748B]">
              {stats.recommendation}
            </p>
            <div className="mt-6 rounded-2xl bg-[#EFF6FF] p-4 text-sm text-[#2563EB]">
              Total batch soal AI: {stats.aiBatches}
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
