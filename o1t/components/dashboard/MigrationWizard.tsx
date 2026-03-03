"use client";

import { useCallback, useState } from "react";
import type { Reservation } from "@/lib/reservations";
import { createReservation } from "@/lib/reservations";

type MigrationWizardProps = {
  onImport: (reservations: Reservation[]) => void;
  onClose: () => void;
};

type ColumnMap = {
  name: number;
  phone: number;
  date: number;
  people: number;
  amount: number;
  status: number;
  notes: number;
};

const DEFAULT_MAP: ColumnMap = {
  name: 0,
  phone: 1,
  date: 2,
  people: 3,
  amount: 4,
  status: 5,
  notes: 6,
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === "," || c === "\t") {
        row.push(cell.trim());
        cell = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cell.trim());
        cell = "";
        if (row.some((x) => x.length > 0)) rows.push(row);
        row = [];
      } else {
        cell += c;
      }
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some((x) => x.length > 0)) rows.push(row);
  }
  return rows;
}

export function MigrationWizard({ onImport, onClose }: MigrationWizardProps) {
  const [step, setStep] = useState<"upload" | "map" | "preview">("upload");
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [columnMap, setColumnMap] = useState<ColumnMap>(DEFAULT_MAP);
  const [error, setError] = useState("");

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const rows = parseCsv(text);
      if (rows.length < 2) {
        setError("데이터가 있는 행이 2개 이상 필요합니다.");
        return;
      }
      setRawRows(rows);
      setStep("map");
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  }, []);

  const headers = rawRows[0] ?? [];
  const dataRows = rawRows.slice(1);

  const setCol = (key: keyof ColumnMap, colIndex: number) => {
    setColumnMap((m) => ({ ...m, [key]: colIndex }));
  };

  const previewRows = dataRows.slice(0, 5).map((row) => ({
    name: row[columnMap.name] ?? "",
    phone: row[columnMap.phone] ?? "",
    date: row[columnMap.date] ?? "",
    people: row[columnMap.people] ?? "",
    amount: row[columnMap.amount] ?? "",
    status: row[columnMap.status] ?? "",
    notes: row[columnMap.notes] ?? "",
  }));

  const handleConfirm = useCallback(() => {
    const reservations: Reservation[] = dataRows.map((row) => {
      const amountStr = row[columnMap.amount] ?? "";
      const amount = amountStr ? parseInt(amountStr.replace(/\D/g, ""), 10) : null;
      const peopleStr = row[columnMap.people] ?? "";
      const people = peopleStr ? parseInt(peopleStr.replace(/\D/g, ""), 10) : null;
      return createReservation({
        name: row[columnMap.name] ?? null,
        phone: row[columnMap.phone] ?? null,
        date: row[columnMap.date] ?? null,
        people: people != null && !Number.isNaN(people) ? people : null,
        notes: row[columnMap.notes] ?? null,
        status: row[columnMap.status] ?? null,
        amount: amount != null && !Number.isNaN(amount) ? amount : null,
      });
    });
    onImport(reservations);
    onClose();
  }, [dataRows, columnMap, onImport, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="migration-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 id="migration-title" className="text-xl font-bold text-foreground">
            엑셀 데이터 업로드
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {step === "upload" && (
          <>
            <p className="mt-2 text-sm text-gray-600">
              CSV 또는 엑셀에서 복사한 데이터를 붙여넣거나, CSV 파일을 선택하세요. 첫 줄은 헤더로 사용됩니다.
            </p>
            <label className="mt-4 flex min-touch cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-gray-600 hover:border-primary hover:bg-primary/5">
              <span className="font-medium">파일 선택 (CSV)</span>
              <input
                type="file"
                accept=".csv,text/csv,application/vnd.ms-excel"
                onChange={handleFile}
                className="sr-only"
              />
            </label>
            {error && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </>
        )}

        {step === "map" && (
          <>
            <p className="mt-2 text-sm text-gray-600">
              각 컬럼이 어떤 항목인지 선택하세요.
            </p>
            <div className="mt-4 space-y-2">
              {(["name", "phone", "date", "people", "amount", "status", "notes"] as const).map(
                (key) => (
                  <div key={key} className="flex items-center gap-4">
                    <span className="w-24 text-sm font-medium">
                      {key === "name"
                        ? "이름"
                        : key === "phone"
                          ? "연락처"
                          : key === "date"
                            ? "예약일시"
                            : key === "people"
                              ? "인원"
                              : key === "amount"
                                ? "금액"
                                : key === "status"
                                  ? "상태"
                                  : "메모"}
                    </span>
                    <select
                      value={columnMap[key]}
                      onChange={(e) => setCol(key, Number(e.target.value))}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value={-1}>— 선택 안 함 —</option>
                      {headers.map((h, i) => (
                        <option key={i} value={i}>
                          {h || `(컬럼 ${i + 1})`}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("upload")}
                className="min-touch rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
              >
                뒤로
              </button>
              <button
                type="button"
                onClick={() => setStep("preview")}
                className="min-touch rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white"
              >
                미리보기
              </button>
            </div>
          </>
        )}

        {step === "preview" && (
          <>
            <p className="mt-2 text-sm text-gray-600">
              총 {dataRows.length}건을 가져옵니다. 아래는 처음 5건 미리보기입니다.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="p-2">이름</th>
                    <th className="p-2">연락처</th>
                    <th className="p-2">예약일시</th>
                    <th className="p-2">인원</th>
                    <th className="p-2">금액</th>
                    <th className="p-2">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((r, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="p-2">{r.name}</td>
                      <td className="p-2">{r.phone}</td>
                      <td className="p-2">{r.date}</td>
                      <td className="p-2">{r.people}</td>
                      <td className="p-2">{r.amount}</td>
                      <td className="p-2">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("map")}
                className="min-touch rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
              >
                뒤로
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="min-touch rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white"
              >
                {dataRows.length}건 가져오기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
