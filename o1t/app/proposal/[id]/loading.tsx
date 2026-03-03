export default function ProposalLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FB" }}>
      <div className="mx-auto max-w-[640px]">
        {/* Hero 스켈레톤 */}
        <div
          className="px-5 pb-10 pt-10"
          style={{ background: "linear-gradient(160deg, #0052FF 0%, #002E99 100%)" }}
        >
          <div className="mb-5 h-6 w-48 animate-pulse rounded-full bg-white/20" />
          <div className="h-8 w-4/5 animate-pulse rounded-lg bg-white/20" />
          <div className="mt-2 h-8 w-3/5 animate-pulse rounded-lg bg-white/20" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-white/10" />
        </div>

        <div className="px-4 pt-6 space-y-5">
          {/* 카드 스켈레톤 × 3 */}
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl bg-white shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-4">
                <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-4 w-48 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="divide-y divide-gray-50">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="flex items-start gap-3 px-5 py-4">
                    <div className="mt-0.5 h-7 w-7 animate-pulse rounded-lg bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                      <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
