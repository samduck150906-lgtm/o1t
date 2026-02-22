"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { ParsedBooking } from "@/app/api/parse-booking/route";
import { isBlacklisted } from "@/lib/blacklist";

export type ReservationItem = {
  id: string;
  name: string | null;
  phone: string | null;
  date: string | null;
  people: number | null;
  notes: string | null;
  status: string | null;
  amount: number | null;
  createdAt: string;
};

type PasteDropZoneProps = {
  onAdd: (r: ReservationItem) => void;
  onSaved?: () => void;
};

export function PasteDropZone({ onAdd, onSaved }: PasteDropZoneProps) {
  const [rawText, setRawText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<ParsedBooking | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const resetInput = useCallback(() => {
    setRawText("");
    setImagePreview(null);
    setImageFile(null);
    setParsed(null);
    setError("");
  }, []);

  const parseAndAdd = useCallback(async () => {
    if (!rawText.trim() && !imageFile) {
      setError("텍스트를 입력하거나 결제/예약 스크린샷을 넣어 주세요.");
      return;
    }
    setError("");
    setLoading(true);
    setParsed(null);
    try {
      let imageBase64: string | undefined;
      if (imageFile) {
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result;
            if (typeof result === "string") resolve(result);
            else reject(new Error("이미지 읽기 실패"));
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(imageFile);
        });
      }
      const res = await fetch("/api/parse-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: rawText.trim() || undefined,
          imageBase64,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "추출에 실패했습니다.");
        return;
      }
      const booking = data as ParsedBooking;
      setParsed(booking);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [rawText, imageFile]);

  const applyToCalendar = useCallback(async () => {
    if (!parsed) return;
    if (parsed.phone && isBlacklisted(parsed.phone)) {
      setError("블랙리스트에 등록된 연락처는 예약을 추가할 수 없습니다.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.name ?? null,
          phone: parsed.phone ?? null,
          date: parsed.date ?? null,
          people: parsed.people ?? null,
          notes: parsed.notes ?? null,
          status: parsed.status ?? null,
          amount: parsed.amount ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "저장에 실패했습니다.");
        return;
      }
      onAdd(data as ReservationItem);
      onSaved?.();
      resetInput();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [parsed, onAdd, onSaved, resetInput]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        setImageFile(file);
        const url = URL.createObjectURL(file);
        setImagePreview(url);
        return () => URL.revokeObjectURL(url);
      }
    },
    []
  );

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
    e.target.value = "";
  }, []);

  const removeImage = useCallback(() => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  }, [imagePreview]);

  return (
    <section
      className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-6 shadow-sm transition-colors md:p-8"
      aria-labelledby="paste-zone-title"
    >
      <h2 id="paste-zone-title" className="text-xl font-bold text-foreground md:text-2xl">
        결제·예약 자료 붙여넣기
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        스크린샷을 던지면 이미지(OCR)로 자동 인식해 정리합니다. 카톡 캡처, 네이버 예약 스크린샷, 입금 확인 캡처, 영수증·결제 화면 모두 지원합니다. 텍스트 붙여넣기도 가능해요.
      </p>

      <div
        className={`mt-6 rounded-xl border-2 border-dashed p-6 transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="텍스트 붙여넣기 또는 아래에 카톡/네이버 예약·입금 확인 스크린샷을 드래그하세요."
          rows={4}
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="텍스트 붙여넣기"
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="min-touch inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-foreground hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary">
            <span className="mr-2">📷</span>
            스크린샷 선택
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="sr-only"
              aria-label="이미지 파일 선택"
            />
          </label>
          {imagePreview && (
            <div className="relative inline-block size-20 overflow-hidden rounded-lg border border-gray-200">
              <Image
                src={imagePreview}
                alt="첨부한 스크린샷"
                width={80}
                height={80}
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                aria-label="이미지 제거"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={parseAndAdd}
          disabled={loading}
          className="min-touch inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          aria-label="자동 추출 후 예약에 반영"
        >
          {loading ? "추출 중…" : "추출 후 예약에 반영"}
        </button>
        {(rawText || imageFile) && (
          <button
            type="button"
            onClick={resetInput}
            className="min-touch rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-foreground hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            지우기
          </button>
        )}
      </div>

      {parsed && (
        <div
          className="mt-6 rounded-xl border border-green-200 bg-green-50/80 p-4"
          role="region"
          aria-label="추출 결과"
        >
          <h3 className="text-sm font-semibold text-foreground">추출 결과 — 예약 리스트·캘린더에 반영할까요?</h3>
          <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
            <div><dt className="inline font-medium text-gray-600">이름 </dt><dd className="inline">{parsed.name ?? "-"}</dd></div>
            <div><dt className="inline font-medium text-gray-600">연락처 </dt><dd className="inline">{parsed.phone ?? "-"}</dd></div>
            <div><dt className="inline font-medium text-gray-600">예약일시 </dt><dd className="inline">{parsed.date ?? "-"}</dd></div>
            <div><dt className="inline font-medium text-gray-600">인원 </dt><dd className="inline">{parsed.people ?? "-"}</dd></div>
            <div><dt className="inline font-medium text-gray-600">금액 </dt><dd className="inline">{parsed.amount != null ? `${parsed.amount.toLocaleString()}원` : "-"}</dd></div>
            <div><dt className="inline font-medium text-gray-600">상태 </dt><dd className="inline">{parsed.status ?? "-"}</dd></div>
            {parsed.notes && (
              <div className="sm:col-span-2"><dt className="inline font-medium text-gray-600">메모 </dt><dd className="inline">{parsed.notes}</dd></div>
            )}
          </dl>
          <button
            type="button"
            onClick={applyToCalendar}
            className="mt-4 min-touch inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            예약 리스트·캘린더에 추가
          </button>
        </div>
      )}
    </section>
  );
}
