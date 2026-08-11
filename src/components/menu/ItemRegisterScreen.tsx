"use client";

import { useState, type FormEvent } from "react";

import { MenuPageLayout } from "@/components/menu/MenuPageLayout";
import { useMenuDataStore } from "@/store/useMenuDataStore";

export function ItemRegisterScreen() {
  const createItem = useMenuDataStore((state) => state.createItem);
  const isLoading = useMenuDataStore((state) => state.isLoading);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [name, setName] = useState("라이트 베이지 재킷");
  const [category, setCategory] = useState("아우터");
  const [color, setColor] = useState("라이트 베이지");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const createdItem = await createItem({ name, category, color });
    setSavedMessage(`${createdItem.name} 아이템을 더미 데이터로 등록했습니다.`);
  };

  return (
    <MenuPageLayout
      activeItem="register"
      eyebrow="ADD ITEM"
      title="아이템 등록"
      description="백엔드 연결 전에도 확인할 수 있는 더미 등록 화면입니다."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-xs font-bold text-[#45454c]">아이템 이름</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 h-12 w-full rounded-[14px] border border-[#dedee2] bg-[#fafafa] px-4 text-sm outline-none focus:border-[#8b7355]"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold text-[#45454c]">카테고리</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 h-12 w-full rounded-[14px] border border-[#dedee2] bg-[#fafafa] px-4 text-sm outline-none focus:border-[#8b7355]"
          >
            <option>상의</option>
            <option>하의</option>
            <option>아우터</option>
            <option>신발</option>
            <option>가방</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold text-[#45454c]">색상</span>
          <input
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="mt-2 h-12 w-full rounded-[14px] border border-[#dedee2] bg-[#fafafa] px-4 text-sm outline-none focus:border-[#8b7355]"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="h-12 w-full rounded-full bg-[#15151a] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "등록 중..." : "더미 아이템 등록"}
        </button>

        {savedMessage ? (
          <p className="rounded-[14px] bg-[#f0ece6] px-4 py-3 text-xs leading-5 text-[#715f49]">
            {savedMessage}
          </p>
        ) : null}
      </form>
    </MenuPageLayout>
  );
}
