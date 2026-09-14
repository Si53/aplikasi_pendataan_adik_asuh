"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ReceiptText,
  BadgePercent,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react"
import { logoutAdminAction } from "@/app/actions/auth"

interface AdminSidebarProps {
  adminName: string
  adminEmail?: string
  totalStudentsCount: number
}

export function AdminSidebar({
  adminName,
  adminEmail,
  totalStudentsCount,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutAdminAction()
      window.location.href = "/admin/login"
    } catch {
      setLoggingOut(false)
    }
  }

  const navItems = [
    {
      label: "Beranda",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Data Anak Asuh",
      href: "/admin/dashboard/data-anak-asuh",
      icon: Users,
      badge: totalStudentsCount,
      exact: false,
    },
    {
      label: "Audit Finansial",
      href: "/admin/dashboard/audit-finansial",
      icon: ReceiptText,
      exact: false,
    },
    {
      label: "Alokasi Dana",
      href: "/admin/dashboard/alokasi-dana",
      icon: BadgePercent,
      exact: false,
    },
    {
      label: "Kontrol Status",
      href: "/admin/dashboard/kontrol-status",
      icon: ShieldCheck,
      exact: false,
    },
  ]

  const isItemActive = (item: (typeof navItems)[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white text-stone-800">
      {/* Top Header & Brand */}
      <div>
        <div className="flex items-center gap-3.5 px-6 py-5 border-b border-stone-200/80 bg-stone-50/50">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs">
            <Image
              src="/logo-kakak-asuh-pvvd.png"
              alt="Logo Adik Asuh"
              fill
              className="object-cover p-0.5"
              sizes="40px"
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-stone-900 text-base tracking-tight truncate">
                Adik Asuh
              </span>
              <span className="inline-flex items-center rounded-full bg-orange-100 px-1.5 py-0.2 text-[9px] font-bold text-orange-700">
                ADMIN
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-orange-600 uppercase">
              PORTAL KAKAK ASUH
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-6">
          <p className="px-3 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Menu Utama
          </p>
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = isItemActive(item)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-orange-500 text-white font-semibold shadow-xs shadow-orange-500/25"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`size-4.5 shrink-0 transition-colors ${
                        active
                          ? "text-white"
                          : "text-stone-400 group-hover:text-stone-700"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-orange-100 text-orange-700 group-hover:bg-orange-200/80"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User & Settings Area */}
      <div className="p-4 border-t border-stone-200/80 bg-stone-50/70">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-sm shadow-xs">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-stone-900 truncate">
                {adminName}
              </span>
              <span className="text-[10px] text-stone-500 truncate">
                {adminEmail || "Administrator"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              title="Pengaturan Admin"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            >
              <Settings className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              title="Keluar Akun"
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer disabled:opacity-50"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 border-r border-stone-200/80 bg-white">
        {sidebarContent}
      </aside>

      {/* Mobile Top Navigation Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative size-8 overflow-hidden rounded-lg border border-stone-200 bg-white">
            <Image
              src="/logo-kakak-asuh-pvvd.png"
              alt="Logo Adik Asuh"
              fill
              className="object-cover p-0.5"
              sizes="32px"
            />
          </div>
          <div>
            <span className="font-extrabold text-stone-900 text-sm">
              Adik Asuh
            </span>
            <span className="ml-1 text-[9px] font-bold text-orange-600">
              ADMIN
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg border border-stone-200 p-2 text-stone-600 hover:bg-stone-100"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Off-canvas Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl transition-transform">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Settings Modal Info */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <Settings className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Info Administrator
                  </h3>
                  <p className="text-xs text-stone-500">
                    Sesi aktif Portal Kakak Asuh
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-stone-600">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                <p className="font-semibold text-stone-800">Nama Admin</p>
                <p className="mt-0.5 text-stone-600">{adminName}</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                <p className="font-semibold text-stone-800">Email Akun</p>
                <p className="mt-0.5 text-stone-600">
                  {adminEmail || "Email terdaftar di Google Auth"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                <p className="font-semibold text-stone-800">Hak Akses</p>
                <p className="mt-0.5 text-emerald-700 font-medium flex items-center gap-1">
                  <Sparkles className="size-3 text-emerald-500" />
                  Full Administrator (Semua Modul & Wilayah)
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="rounded-xl bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
