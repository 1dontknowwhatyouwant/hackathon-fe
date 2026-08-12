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
  },
  {
    id: "item-02",
    name: "와이드 데님",
    category: "하의",
    color: "인디고",
    colorHex: "#52647a",
  },
  {
    id: "item-03",
    name: "레더 스니커즈",
    category: "신발",
    color: "화이트",
    colorHex: "#f5f5f2",
  },
  {
    id: "item-04",
    name: "미니 크로스백",
    category: "가방",
    color: "브라운",
    colorHex: "#806a51",
  },
];

export const dummyUser: UserInfo = {
  userId: "preview-user",
  email: "preview@wear-it.example",
  nickname: "오늘도입을래",
  profileImageUrl: null,
};
