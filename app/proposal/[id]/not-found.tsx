import Link from "next/link";

export default function ProposalNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">제안서를 찾을 수 없습니다</h1>
      <p className="text-gray-600 mb-6">
        링크가 만료되었거나 잘못되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="text-blue-600 font-medium hover:underline"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
