import type { UserInfo } from "@/store/useAuthStore";
import type {
  ClosetItem,
  PostSummary,
} from "@/types/menu";

export const dummyPosts: PostSummary[] = Array.from(
  { length: 24 },
  (_, index) => ({
    id: index + 1,
    title: `협업 확인용 게시글 ${String(index + 1).padStart(2, "0")}`,
  }),
);

export const dummyClosetItems: ClosetItem[] = [
  {
    id: "item-01",
    name: "오프화이트 셔츠",
    category: "상의",
    color: "오프화이트",
    colorHex: "#e9e4da",
    brandName: "COS",
    material: "코튼 100%",
    purchaseDate: "2026-04-18",
    purchasePrice: 129_000,
    memo: "출근 룩과 데일리 코디에 자주 입는 셔츠",
  },
  {
    id: "item-02",
    name: "와이드 데님",
    category: "하의",
    color: "인디고",
    colorHex: "#52647a",
    brandName: "LEVI'S",
    material: "데님 코튼",
    purchaseDate: "2026-02-03",
    purchasePrice: 159_000,
    memo: "오프화이트 셔츠와 가장 자주 조합하는 데님",
  },
  {
    id: "item-03",
    name: "레더 스니커즈",
    category: "신발",
    color: "화이트",
    colorHex: "#f5f5f2",
    brandName: "MCM",
    material: "카프 레더",
    purchaseDate: "2026-05-27",
    purchasePrice: 690_000,
    memo: "밝은 색상의 가방과 함께 착용",
  },
  {
    id: "item-04",
    name: "Aren Shopper in Visetos",
    category: "가방",
    color: "브라운",
    colorHex: "#806a51",
    brandName: "MCM",
    material: "비세토스 · 나파 레더",
    purchaseDate: "2026-08-01",
    purchasePrice: 1_450_000,
    memo: "제품 패스포트가 연결된 MCM 쇼퍼백",
  },
];

export const dummyUser: UserInfo = {
  userId: "preview-user",
  email: "preview@wear-it.example",
  nickname: "오늘도입을래",
  profileImageUrl: null,
};
