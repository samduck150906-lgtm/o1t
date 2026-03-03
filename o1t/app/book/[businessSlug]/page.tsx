import type { Metadata } from "next";
import { BookForm } from "./BookForm";

type Props = { params: Promise<{ businessSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { businessSlug } = await params;
  return {
    title: "예약하기",
    description: `${businessSlug} 예약 페이지입니다. 날짜와 시간을 선택해 예약을 완료하세요.`,
  };
}

export default async function BookPage({ params }: Props) {
  const { businessSlug } = await params;
  return (
    <div className="mx-auto max-w-lg px-4 py-12 md:py-16">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        예약하기
      </h1>
      <p className="mt-2 text-gray-600">
        아래 양식을 작성하시면 사장님 캘린더에 바로 반영됩니다.
      </p>
      <BookForm businessSlug={businessSlug} />
    </div>
  );
}
