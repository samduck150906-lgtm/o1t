"use client";

import { useState } from "react";

export function ToolCalculator() {
  const [count, setCount] = useState(5);
  const saved = count - 1;

  return (
    <section
      className="-mx-3 sm:-mx-4 bg-navy px-4 py-14 sm:py-20 text-white"
      aria-labelledby="calculator-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full border border-blue-400/30 bg-blue-500/20 px-4 py-1.5 text-sm font-semibold text-blue-300 tracking-wide">
          원툴러 절약 계산기
        </span>
        <h2
          id="calculator-heading"
          className="mt-4 text-2xl font-bold leading-snug sm:text-3xl md:text-4xl"
        >
          지금 예약·상담에
          <br />
          <span className="text-blue-300">몇 가지 툴</span>을 쓰고 계세요?
        </h2>
        <p className="mt-3 text-base text-white/60">
          카카오톡, 전화, 예약앱, 엑셀, 문자, 상담 메신저… 전부 세어보세요
        </p>

        {/* 카운터 */}
        <div className="mt-10 flex items-center justify-center gap-8">
          <button
            onClick={() => setCount(Math.max(1, count - 1))}
            aria-label="줄이기"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-3xl font-light text-white transition-colors hover:bg-white/20 active:bg-white/30"
          >
            −
          </button>
          <div className="flex items-end justify-center gap-1.5">
            <span className="text-[80px] font-black leading-none tabular-nums">{count}</span>
            <span className="mb-3 text-2xl font-medium text-white/70">개</span>
          </div>
          <button
            onClick={() => setCount(Math.min(20, count + 1))}
            aria-label="늘리기"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-3xl font-light text-white transition-colors hover:bg-white/20 active:bg-white/30"
          >
            +
          </button>
        </div>

        {/* 결과 */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <p className="mb-5 text-sm font-medium text-white/50 uppercase tracking-widest">
            원툴러 도입 후
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="text-center">
              <span className="block text-5xl font-black tabular-nums text-red-400 line-through">
                {count}개
              </span>
              <span className="mt-1 block text-sm text-white/40">지금</span>
            </div>
            <span className="text-3xl font-light text-white/30">→</span>
            <div className="text-center">
              <span className="block text-5xl font-black tabular-nums text-blue-300">1개</span>
              <span className="mt-1 block text-sm text-white/40">원툴러</span>
            </div>
          </div>
          <p className="mt-6 text-lg text-white/80 leading-relaxed">
            <span className="font-bold text-white">{saved}개의 툴</span>을 없애고,{" "}
            관리 시간을 <span className="font-bold text-white">대폭 줄일 수 있습니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
