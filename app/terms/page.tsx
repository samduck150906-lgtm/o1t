import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold">이용약관</h1>
        <p className="text-gray-600">본 서비스는 이터널식스에서 제공합니다.</p>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">제 1 조 (목적)</h2>
          <p>이 약관은 회사가 제공하는 서비스 이용과 관련하여 회사와 이용자 간의 권리 의무를 규정합니다.</p>
        </section>
      </div>
    </div>
  );
}
