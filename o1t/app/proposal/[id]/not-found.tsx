import Link from "next/link";

export default function ProposalNotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#F8F9FB" }}
    >
      <div className="w-full max-w-sm text-center">
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{ backgroundColor: "#EFF6FF" }}
        >
          🔍
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          제안서를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          링크가 만료되었거나 잘못된 주소입니다.
          <br />
          담당자에게 다시 요청해 주세요.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: "#0052FF" }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
