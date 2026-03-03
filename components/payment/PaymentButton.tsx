"use client";

import { useCallback, useState } from "react";

declare global {
  interface Window {
    TossPayments?: {
      requestBillingAuth: (params: {
        method: "CARD";
        customerKey: string;
        amount: number;
        orderId: string;
        orderName: string;
        customerEmail?: string;
        customerName?: string;
        successUrl: string;
        failUrl: string;
      }) => Promise<unknown>;
      requestPayment: (method: string, params: {
        amount: number;
        orderId: string;
        orderName: string;
        customerEmail?: string;
        customerName?: string;
        successUrl: string;
        failUrl: string;
      }) => Promise<unknown>;
    };
  }
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";

type PaymentButtonProps = {
  amount: number;
  orderId: string;
  orderName: string;
  customerKey?: string;
  customerEmail?: string;
  customerName?: string;
  mode?: "one-time" | "billing";
  children?: React.ReactNode;
};

export function PaymentButton({
  amount,
  orderId,
  orderName,
  customerKey,
  customerEmail,
  customerName,
  mode = "one-time",
  children,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleClick = useCallback(async () => {
    if (!clientKey) {
      alert("결제 설정이 완료되지 않았습니다.");
      return;
    }
    setLoading(true);
    try {
      const script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v2/payment";
      script.async = true;
      document.body.appendChild(script);
      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Toss Payments 스크립트 로드 실패"));
      });
      const TossPayments = window.TossPayments;
      if (!TossPayments) {
        alert("결제를 불러올 수 없습니다.");
        return;
      }
      const successUrl = `${baseUrl}/api/payment/success`;
      const failUrl = `${baseUrl}/api/payment/fail`;
      if (mode === "billing" && customerKey) {
        await TossPayments.requestBillingAuth({
          method: "CARD",
          customerKey,
          amount,
          orderId,
          orderName,
          customerEmail,
          customerName,
          successUrl,
          failUrl,
        });
      } else {
        await TossPayments.requestPayment("카드", {
          amount,
          orderId,
          orderName,
          customerEmail,
          customerName,
          successUrl,
          failUrl,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "결제 요청에 실패했습니다.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }, [amount, orderId, orderName, customerKey, customerEmail, customerName, mode, baseUrl]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="min-touch inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
      aria-label="결제하기"
    >
      {children ?? (loading ? "처리 중…" : "결제하기")}
    </button>
  );
}
