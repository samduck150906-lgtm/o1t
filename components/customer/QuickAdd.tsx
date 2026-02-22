"use client";

import { useState } from "react";

type ParsedCustomer = {
  name: string | null;
  phone: string | null;
  date: string | null;
  people: number | null;
  notes: string | null;
  status: string | null;
};

export function QuickAdd({
  onSave,
  compact = false,
}: {
  onSave?: (data: ParsedCustomer) => void;
  compact?: boolean;
}) {
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState<ParsedCustomer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  async function handleParse() {
    if (!rawText.trim()) {
      setError("텍스트를 입력해 주세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/parse-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: rawText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "파싱에 실패했습니다.");
        setParsed(null);
        return;
      }
      setParsed(data as ParsedCustomer);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setParsed(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (parsed && onSave) onSave(parsed);
    setRawText("");
    setParsed(null);
    setModalOpen(false);
  }

  const formBlock = (
    <>
      <label htmlFor="quickadd-raw" className="block text-sm font-medium text-foreground">
        카톡·문자 대화를 붙여넣기 하세요
      </label>
      <textarea
        id="quickadd-raw"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="고객과 나눈 대화 내용을 복사해 붙여넣으면 이름, 연락처, 예약일시를 자동으로 추출합니다."
        rows={5}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label="대화 내용 붙여넣기"
      />
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handleParse}
        disabled={loading}
        className="mt-4 flex min-touch items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        aria-label="고객 정보 자동 추출"
      >
        {loading ? "추출 중…" : "자동 추출"}
      </button>
      {parsed && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4" role="region" aria-label="추출 결과">
          <h3 className="text-sm font-semibold text-foreground">추출 결과 (확인 후 저장)</h3>
          <dl className="mt-2 space-y-1 text-sm">
            <div><dt className="inline font-medium text-gray-600">이름: </dt><dd className="inline">{parsed.name ?? "-"}</dd></div>
            <div><dt className="inline font-medium text-gray-600">연락처: </dt><dd className="inline">{parsed.phone ?? "-"}</dd></div>
            <div><dt className="inline font-medium text-gray-600">예약일시: </dt><dd className="inline">{parsed.date ?? "-"}</dd></div>
            <div><dt className="inline font-medium text-gray-600">인원: </dt><dd className="inline">{parsed.people ?? "-"}</dd></div>
            <div><dt className="inline font-medium text-gray-600">특이사항: </dt><dd className="inline">{parsed.notes ?? "-"}</dd></div>
            <div><dt className="inline font-medium text-gray-600">상태: </dt><dd className="inline">{parsed.status ?? "-"}</dd></div>
          </dl>
          {onSave && (
            <button
              type="button"
              onClick={handleSave}
              className="mt-4 flex min-touch items-center justify-center rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="고객 명단에 저장"
            >
              명단에 저장
            </button>
          )}
        </div>
      )}
    </>
  );

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:bottom-8"
          aria-label="고객 빠른 추가 (복붙)"
        >
          <span className="text-2xl" aria-hidden>+</span>
        </button>
        {modalOpen && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quickadd-dialog-title"
          >
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
              <h2 id="quickadd-dialog-title" className="text-lg font-semibold text-foreground">
                고객 빠른 추가
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                대화 내용을 붙여넣으면 AI가 이름·연락처·예약일시를 추출합니다.
              </p>
              <div className="mt-4">{formBlock}</div>
              <button
                type="button"
                onClick={() => { setModalOpen(false); setRawText(""); setParsed(null); setError(""); }}
                className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-foreground hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                aria-label="닫기"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6" aria-labelledby="quickadd-title">
      <h2 id="quickadd-title" className="text-lg font-semibold text-foreground">
        고객 빠른 추가 (복붙)
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        카톡·문자 대화를 붙여넣으면 AI가 자동으로 고객 정보를 추출합니다.
      </p>
      <div className="mt-4">{formBlock}</div>
    </div>
  );
}
