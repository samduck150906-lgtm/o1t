"use client";

import { useEffect, useState } from "react";
import {
  isOnboardingDone,
  setOnboardingDone,
  getIndustry,
  setIndustry,
  getSetupGuide,
  INDUSTRY_LABELS,
  type Industry,
} from "@/lib/onboarding";

type OnboardingModalProps = {
  onComplete?: () => void;
};

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"industry" | "guide">("industry");
  const [industry, setIndustryLocal] = useState<Industry>(getIndustry());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isOnboardingDone()) setOpen(true);
  }, []);

  const handleIndustrySelect = (value: Industry) => {
    setIndustryLocal(value);
    setIndustry(value);
    setStep("guide");
  };

  const handleFinish = () => {
    setOnboardingDone();
    setOpen(false);
    onComplete?.();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <h2 id="onboarding-title" className="text-xl font-bold text-foreground">
          {step === "industry" ? "업종을 선택해 주세요" : "맞춤 셋팅 가이드"}
        </h2>

        {step === "industry" && (
          <>
            <p className="mt-2 text-sm text-gray-600">
              선택하신 업종에 맞는 사용 팁을 안내합니다.
            </p>
            <ul className="mt-4 space-y-2">
              {(Object.entries(INDUSTRY_LABELS) as [Industry, string][]).map(
                ([value, label]) => (
                  <li key={value}>
                    <button
                      type="button"
                      onClick={() => handleIndustrySelect(value)}
                      className="min-touch w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-left font-medium text-foreground hover:border-primary hover:bg-primary/5"
                    >
                      {label}
                    </button>
                  </li>
                )
              )}
            </ul>
          </>
        )}

        {step === "guide" && (
          <>
            <p className="mt-2 text-sm text-gray-600">
              {INDUSTRY_LABELS[industry]}에 맞는 활용 팁입니다.
            </p>
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm text-foreground">
              {getSetupGuide(industry)}
            </pre>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("industry")}
                className="min-touch rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700"
              >
                업종 다시 선택
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="min-touch flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
              >
                시작하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
