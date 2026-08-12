"use client";

import { useEffect, useMemo, useState } from "react";
import Pagination from "@/components/common/pagination/Pagination";
import { dummyPosts } from "@/data/menuPageDummies";
import type { PostSummary } from "@/types/menu";

const PAGE_SIZE = 10;

const PostsListScreen = () => {
  const [currentPage /* 상태 관리 */, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiPage = currentPage - 1; /*백엔드에 0-based 페이지 전달 */

  useEffect(() => {
    /*목록 api 호출*/
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 게시글은 API v0.2 범위 밖의 페이지네이션 UI 확인용 데이터입니다.
        const startIndex = apiPage * PAGE_SIZE;
        setPosts(dummyPosts.slice(startIndex, startIndex + PAGE_SIZE));
        setTotalPages(Math.ceil(dummyPosts.length / PAGE_SIZE));
      } catch {
        setError("목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPosts();
  }, [apiPage]);

  const pageLabel = useMemo(
    () => `${currentPage} / ${totalPages}`,
    [currentPage, totalPages],
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-50">
      <section className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-lime-300">
            Posts
          </p>
          <h1 className="text-3xl font-semibold">목록 페이지</h1>
          <p className="text-sm text-slate-300">현재 페이지: {pageLabel}</p>
        </div>

        {isLoading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">
            불러오는 중...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-900 bg-red-950/60 p-6 text-red-200">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <ul className="grid gap-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded-2xl bg-slate-800/70 px-4 py-3"
              >
                {post.id}. {post.title}
              </li>
            ))}
          </ul>
        )}

        <Pagination /*Pagination에 하단 3개 항목 전달 */
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
};

export default PostsListScreen;
