"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Check,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  MessageSquare,
  AlertCircle,
} from "lucide-react"
import { updateStudentStatusAction } from "@/app/actions/admin"

interface AdminPendingApprovalActionsProps {
  studentId: number
  studentName: string
}

export function AdminPendingApprovalActions({
  studentId,
  studentName,
}: AdminPendingApprovalActionsProps) {
  const router = useRouter()
  const [modalTarget, setModalTarget] = useState<{
    targetStatus: "approved" | "rejected"
    actionLabel: string
  } | null>(null)
  const [reason, setReason] = useState("")
  const [isPending, startTransition] = useTransition()
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const handleConfirmStatusChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalTarget) return

    const cleanReason = reason.trim()
    if (!cleanReason) {
      setActionError("Alasan keputusan verifikasi wajib diisi.")
      return
    }

    setActionError(null)
    setActionSuccess(null)

    startTransition(async () => {
      const res = await updateStudentStatusAction(
        studentId,
        modalTarget.targetStatus,
        cleanReason
      )

      if (res.success) {
        setActionSuccess(
          `Status pendaftaran adik asuh berhasil diperbarui menjadi "${modalTarget.targetStatus.toUpperCase()}".`
        )
        setModalTarget(null)
        setReason("")
        router.refresh()
      } else {
        setActionError(res.error || "Gagal memperbarui status pendaftaran.")
      }
    })
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto self-stretch sm:self-center border-t sm:border-t-0 pt-4 sm:pt-0 border-stone-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl">
          <Clock className="size-3.5 text-amber-600 animate-pulse" />
          <span>Menunggu Keputusan</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Tombol Setujui */}
          <button
            type="button"
            onClick={() => {
              setModalTarget({
                targetStatus: "approved",
                actionLabel: "Setujui Pendaftaran Adik Asuh",
              })
              setReason("")
              setActionError(null)
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs shadow-emerald-600/20 transition cursor-pointer"
          >
            <Check className="size-4" />
            <span>Setujui</span>
          </button>

          {/* Tombol Tolak */}
          <button
            type="button"
            onClick={() => {
              setModalTarget({
                targetStatus: "rejected",
                actionLabel: "Tolak Pendaftaran Adik Asuh",
              })
              setReason("")
              setActionError(null)
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2 text-xs sm:text-sm font-bold text-rose-700 transition cursor-pointer"
          >
            <X className="size-4" />
            <span>Tolak</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert if any */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-600 text-white p-4 shadow-xl border border-emerald-500 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => {
            if (!isPending) setModalTarget(null)
          }}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="p-6 border-b border-stone-100 bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-white flex items-start gap-4">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-xs text-white ${
                  modalTarget.targetStatus === "approved"
                    ? "bg-emerald-600"
                    : "bg-rose-600"
                }`}
              >
                {modalTarget.targetStatus === "approved" ? (
                  <CheckCircle2 className="size-6" />
                ) : (
                  <XCircle className="size-6" />
                )}
              </div>

              <div className="space-y-1 flex-1">
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  {modalTarget.actionLabel}
                </h3>
                <p className="text-xs text-stone-500">
                  Adik Asuh: <strong className="text-stone-900">{studentName}</strong>
                </p>
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={() => setModalTarget(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form & Body */}
            <form onSubmit={handleConfirmStatusChange} className="p-6 space-y-5">
              {/* Box Info Perubahan */}
              <div className="rounded-2xl bg-stone-50 border border-stone-200/80 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Status Saat Ini:</span>
                  <span className="font-bold text-stone-800 uppercase font-mono">
                    PENDING (Menunggu Review)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Status Baru yang Dituju:</span>
                  <span
                    className={`font-black uppercase font-mono ${
                      modalTarget.targetStatus === "approved"
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {modalTarget.targetStatus}
                  </span>
                </div>
              </div>

              {/* Textarea Alasan WAJIB */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-stone-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="size-4 text-orange-500" />
                    <span>Alasan Keputusan Status *</span>
                  </span>
                  <span className="text-[11px] font-semibold text-rose-500">Wajib Diisi</span>
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    modalTarget.targetStatus === "approved"
                      ? "Contoh: Berkas pendaftaran valid dan memenuhi kriteria penerima beasiswa..."
                      : "Contoh: Kuota wilayah penuh / Dokumen persyaratan tidak memenuhi kriteria..."
                  }
                  required
                  className="w-full rounded-2xl border border-stone-300 bg-white p-3.5 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition resize-none"
                />
                <p className="text-[11px] text-stone-400">
                  Alasan ini akan otomatis tercatat di log <strong>AdminNote</strong> sebagai riwayat audit sistem.
                </p>
              </div>

              {actionError && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="size-4 text-rose-600 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setModalTarget(null)}
                  className="rounded-2xl border border-stone-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-stone-600 hover:bg-stone-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending || !reason.trim()}
                  className={`inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer ${
                    modalTarget.targetStatus === "approved"
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
                      : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25"
                  }`}
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  <span>{isPending ? "Memproses..." : "Konfirmasi & Simpan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
