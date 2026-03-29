import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold">취소 및 환불정책</h1>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">환불 기준</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>결제 후 7일 이내 미사용 시 전액 환불</li>
            <li>문의: ceo@eternalsix.kr</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
