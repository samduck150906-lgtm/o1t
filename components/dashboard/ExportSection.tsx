"use client";

import type { Reservation } from "@/lib/reservations";
import {
  buildCustomerListCsv,
  buildReservationHistoryCsv,
  buildTaxSalesCsv,
  downloadCsv,
} from "@/lib/export-data";
import { canExportData } from "@/lib/roles";

type ExportSectionProps = {
  reservations: Reservation[];
};

export function ExportSection({ reservations }: ExportSectionProps) {
  if (!canExportData()) return null;

  const handleCustomerList = () => {
    const csv = buildCustomerListCsv(reservations);
    downloadCsv(csv, `고객명단_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleReservationHistory = () => {
    const csv = buildReservationHistoryCsv(reservations);
    downloadCsv(csv, `예약이력_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleTaxSales = () => {
    const csv = buildTaxSalesCsv(reservations);
    downloadCsv(csv, `세금계산서용_매출_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <section
      className="rounded-2xl border border-gray-200 bg-white p-6"
      aria-labelledby="export-title"
    >
      <h2 id="export-title" className="text-lg font-semibold text-foreground">
        데이터 내보내기
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        엑셀에서 열 수 있는 CSV 파일로 다운로드됩니다.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCustomerList}
          className="min-touch rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-gray-50"
        >
          고객 명단 (CSV)
        </button>
        <button
          type="button"
          onClick={handleReservationHistory}
          className="min-touch rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-gray-50"
        >
          예약 이력 (CSV)
        </button>
        <button
          type="button"
          onClick={handleTaxSales}
          className="min-touch rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-gray-50"
        >
          세금계산서용 매출 (CSV)
        </button>
      </div>
    </section>
  );
}
