import type { Metadata } from "next";
import { DemoERP } from "./DemoERP";

export const metadata: Metadata = {
  title: "ERP 데모 미리보기 | OwnerOneTool",
  description:
    "로그인 없이 OwnerOneTool ERP의 예약·고객·캘린더 관리 화면을 체험해보세요. 실제 운영 화면과 동일한 UI입니다.",
};

export default function DemoPage() {
  return <DemoERP />;
}
