export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-hidden
        />
        <p className="text-sm text-gray-600">불러오는 중…</p>
      </div>
    </div>
  );
}
