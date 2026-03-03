/**
 * 200개 키워드 자동 생성 스크립트
 * 업종(10) × 지역(10) × 고통/해결(2) = 200개 고유 데이터셋
 * lib/seo-keywords.ts와 동일한 데이터를 JSON/CSV로 출력해 SSG·엑셀에서 활용
 */
import fs from "fs";
import path from "path";
import { landingKeywords } from "../lib/seo-keywords";

const OUT_DIR = path.resolve(process.cwd());

// JSON 저장 (SSG·API 등에서 활용)
const jsonPath = path.join(OUT_DIR, "keywords.json");
fs.writeFileSync(jsonPath, JSON.stringify(landingKeywords, null, 2), "utf-8");

// CSV 저장 (엑셀용)
const csvHeader = "id,location,industry,keyword,painPoint,description\n";
const csvRows = landingKeywords
  .map(
    (d) =>
      `${d.id},${escapeCsv(d.location)},${escapeCsv(d.industry)},${escapeCsv(d.keyword)},${escapeCsv(d.painPoint)},${escapeCsv(d.description)}`
  )
  .join("\n");
fs.writeFileSync(
  path.join(OUT_DIR, "keywords.csv"),
  "\uFEFF" + csvHeader + csvRows,
  "utf-8"
);

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

console.log(`${landingKeywords.length}개의 키워드 데이터 생성 완료!`);
console.log(`  - ${jsonPath}`);
console.log(`  - ${path.join(OUT_DIR, "keywords.csv")}`);
