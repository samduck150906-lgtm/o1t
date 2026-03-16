"use client";

import { useState } from "react";
import type { ParsedCustomer } from "@/app/api/parse-customer/route";
import { isLowConfidence } from "@/lib/parse-confidence";

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

  const lowConfidence = parsed ? isLowConfidence(parsed.aiConfidenceScore ?? 0) : false;

  function handleSave() {
    if (!parsed || !onSave) return;
    if (lowConfidence) return;
    onSave(parsed);
    setRawText("");
    setParsed(null);
    setModalOpen(false);
  }

  const formBlock = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <label htmlFor="quickadd-raw" className="sr-only">
        대화 내용을 붙여넣어 주세요
      </label>
      <div style={{ position: "relative" }}>
        <textarea
          id="quickadd-raw"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="여기에 카톡이나 문자 대화를 길게 누르거나 복사해서 붙여넣으세요..."
          rows={4}
          className="erp-input"
          style={{ resize: "vertical", paddingRight: 100, borderRadius: 12 }}
          aria-label="대화 내용 붙여넣기"
        />
        <button
          type="button"
          onClick={handleParse}
          disabled={loading}
          className="erp-btn erp-btn--primary erp-btn--sm"
          style={{ position: "absolute", bottom: 12, right: 12 }}
          aria-label="고객 정보 자동 추출"
        >
          {loading ? (
            <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span className="erp-skeleton" style={{ width: 12, height: 12, borderRadius: "50%" }}></span>
              추출 중
            </span>
          ) : (
            "✨ 정보 추출"
          )}
        </button>
      </div>

      {error && (
        <p role="alert" style={{ fontSize: 13, color: "#ef4444", fontWeight: 500 }}>
          {error}
        </p>
      )}

      {parsed && (
        <div
          style={{ 
            borderRadius: 12, 
            padding: 16, 
            border: lowConfidence ? "1px solid #fca5a5" : "1px solid #86efac",
            background: lowConfidence ? "#fef2f2" : "#f0fdf4" 
          }}
          role="region"
          aria-label="추출 결과"
        >
          {lowConfidence && (
            <p role="alert" style={{ marginBottom: 16, fontSize: 12, fontWeight: 600, color: "#dc2626" }}>
              ⚠ AI 신뢰도가 낮아 자동 저장이 차단됩니다 ({(parsed.aiConfidenceScore * 100).toFixed(0)}%). 내용을 점검하고 수동 등록해주세요.
            </p>
          )}
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>추출 확인</h3>
            <span style={{ fontSize: 11, color: "#059669", background: "#d1fae5", padding: "2px 8px", borderRadius: 100, fontWeight: 600 }}>
              AI 자동 정리 성공
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.8)", padding: 10, borderRadius: 8 }}>
               <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: "-0.02em" }}>고객명</p>
               <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 2 }}>{parsed.name ?? "-"}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.8)", padding: 10, borderRadius: 8 }}>
               <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: "-0.02em" }}>연락처</p>
               <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 2 }}>{parsed.phone ?? "-"}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.8)", padding: 10, borderRadius: 8 }}>
               <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: "-0.02em" }}>예약일시</p>
               <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 2 }}>{parsed.date ?? "-"}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.8)", padding: 10, borderRadius: 8 }}>
               <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: "-0.02em" }}>인원</p>
               <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 2 }}>{parsed.people ?? "-"}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.8)", padding: 10, borderRadius: 8 }}>
               <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: "-0.02em" }}>상태</p>
               <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 2 }}>{parsed.status ?? "-"}</p>
            </div>
          </div>
          
          <div style={{ background: "rgba(255,255,255,0.8)", padding: 10, borderRadius: 8, marginBottom: 16 }}>
             <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: "-0.02em" }}>메모 / 특이사항</p>
             <p style={{ fontSize: 13, color: "#374151", marginTop: 2, lineHeight: 1.4 }}>{parsed.notes ?? "-"}</p>
          </div>

          {onSave && (
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setParsed(null)}
                className="erp-btn erp-btn--secondary"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={lowConfidence}
                className="erp-btn erp-btn--primary"
                aria-label="명단에 저장"
              >
                고객 명단에 저장
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 30,
            width: 56, height: 56, borderRadius: "50%", background: "#0052FF", color: "white",
            boxShadow: "0 8px 32px rgba(0,82,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", cursor: "pointer", transition: "transform 0.15s"
          }}
          aria-label="빠른 정보 추가"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-7 w-7">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </button>

        {modalOpen && (
          <div
            className="erp-overlay"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            role="dialog"
            aria-modal="true"
          >
            <div style={{ background: "white", width: "100%", maxWidth: 500, borderRadius: 16, padding: "24px 20px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 6 }}>빠른 고객 추가</h2>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
                카톡 내용을 붙여넣어 쉽게 정보를 저장하세요.
              </p>
              {formBlock}
              <button
                type="button"
                onClick={() => { setModalOpen(false); setRawText(""); setParsed(null); setError(""); }}
                className="erp-btn erp-btn--secondary"
                style={{ width: "100%", marginTop: 12 }}
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
    <div style={{ padding: 24 }}>
      {formBlock}
    </div>
  );
}
