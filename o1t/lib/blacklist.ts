/** 블랙리스트: 연락처 기준 예약 차단 */

const BLACKLIST_STORAGE_KEY = "o1t_blacklist";

export function loadBlacklist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BLACKLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string").map(normalizePhone)
      : [];
  } catch {
    return [];
  }
}

export function saveBlacklist(phones: string[]): void {
  if (typeof window === "undefined") return;
  try {
    const normalized = Array.from(new Set(phones.map(normalizePhone).filter(Boolean)));
    localStorage.setItem(BLACKLIST_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // ignore
  }
}

export function addToBlacklist(phone: string): void {
  const list = loadBlacklist();
  const key = normalizePhone(phone);
  if (key && !list.includes(key)) {
    saveBlacklist([...list, key]);
  }
}

export function removeFromBlacklist(phone: string): void {
  const key = normalizePhone(phone);
  saveBlacklist(loadBlacklist().filter((p) => p !== key));
}

export function isBlacklisted(phone: string | null): boolean {
  if (!phone || !phone.trim()) return false;
  return loadBlacklist().includes(normalizePhone(phone));
}

function normalizePhone(phone: string): string {
  return phone.replace(/\s|-|\./g, "").trim() || "";
}
