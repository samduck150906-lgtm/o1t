import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground">404</h1>
      <p className="mt-3 text-center text-gray-600">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-touch items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="홈으로 이동"
      >
        홈으로
      </Link>
    </div>
  );
}
