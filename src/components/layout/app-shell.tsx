import Link from "next/link";
import {
  BrainCircuit,
  LayoutDashboard,
  BookOpenCheck,
  FileBarChart2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentSessionUser } from "@/lib/session";

const menus = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["USER", "ADMIN", "SUPERADMIN"] },
  { href: "/materi", label: "Materi", icon: BookOpenCheck, roles: ["USER", "ADMIN", "SUPERADMIN"] },
  { href: "/latihan", label: "Latihan Soal", icon: BrainCircuit, roles: ["USER", "ADMIN", "SUPERADMIN"] },
  { href: "/tryout", label: "Try Out CAT", icon: FileBarChart2, roles: ["USER", "ADMIN", "SUPERADMIN"] },
  { href: "/admin/generate-ai", label: "Generate Soal AI", icon: Sparkles, roles: ["USER", "ADMIN", "SUPERADMIN"] },
  { href: "/superadmin/users", label: "User Management", icon: ShieldCheck, roles: ["SUPERADMIN"] },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentSessionUser();
  const role = user?.role ?? "USER";
  const visibleMenus = menus.filter((menu) => menu.roles.includes(role));

  return (
    <div className="min-h-screen text-[#0F172A]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-72 shrink-0 rounded-[28px] border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-[0_20px_50px_-30px_rgba(37,99,235,0.35)] lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-[#2563EB] p-3 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold">Yuk Kita Bisa PNS</p>
              <p className="text-sm text-[#64748B]">
                Belajar, latihan, try out, AI.
              </p>
            </div>
          </div>
          <nav className="space-y-2">
            {visibleMenus.map((menu) => {
              const Icon = menu.icon;
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#0F172A] transition hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                >
                  <Icon className="h-4 w-4" />
                  {menu.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 border-t border-[#E2E8F0] pt-5">
            <div className="mb-3 rounded-2xl bg-[#F8FAFC] p-3 text-xs text-[#64748B]">
              <p className="font-semibold text-[#0F172A]">{user?.name ?? user?.email}</p>
              <p>{role}</p>
            </div>
            <LogoutButton />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
