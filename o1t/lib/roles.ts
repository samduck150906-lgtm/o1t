/**
 * Enterprise용 직원 권한 (localStorage 기반 데모)
 * 역할: admin | manager | staff
 */

const PLAN_KEY = "o1t_plan";
const ROLE_KEY = "o1t_user_role";

export type Plan = "free" | "starter" | "pro" | "enterprise";
export type Role = "admin" | "manager" | "staff";

export function getPlan(): Plan {
  if (typeof window === "undefined") return "free";
  const v = localStorage.getItem(PLAN_KEY);
  if (v === "enterprise" || v === "pro" || v === "starter") return v;
  return "free";
}

export function setPlan(plan: Plan): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAN_KEY, plan);
}

export function getRole(): Role {
  if (typeof window === "undefined") return "admin";
  const v = localStorage.getItem(ROLE_KEY);
  if (v === "manager" || v === "staff") return v;
  return "admin";
}

export function setRole(role: Role): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
}

export function isEnterprise(): boolean {
  return getPlan() === "enterprise";
}

/** 직원 권한: 설정 변경 가능 여부 */
export function canEditSettings(): boolean {
  if (!isEnterprise()) return true;
  return getRole() === "admin";
}

/** 블랙리스트/노쇼 등 민감 관리 가능 */
export function canManageBlacklist(): boolean {
  if (!isEnterprise()) return true;
  return getRole() === "admin" || getRole() === "manager";
}

/** 데이터 내보내기 가능 */
export function canExportData(): boolean {
  if (!isEnterprise()) return true;
  return getRole() !== "staff";
}

/** 직원 계정 관리(역할 변경) 가능 - admin 전용 */
export function canManageStaff(): boolean {
  if (!isEnterprise()) return false;
  return getRole() === "admin";
}
