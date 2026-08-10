"use client";

import { useEffect, useMemo, useState } from "react";
import Pagination from "@/components/common/pagination/Pagination";
import { api } from "@/lib/axios";

type Post = {
  id: number;
  title: string;
};

type PostsResponse = {
  content: Post[];
  totalPages: number;
};

const PAGE_SIZE = 10;

const PostsListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiPage = currentPage - 1;

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<PostsResponse>("/posts", {
          params: {
            page: apiPage,
            size: PAGE_SIZE,
          },
        });

        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch {
        setError("목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPosts();
  }, [apiPage]);

  const pageLabel = useMemo(() => `${currentPage} / ${totalPages}`, [currentPage, totalPages]);

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
              <li key={post.id} className="rounded-2xl bg-slate-800/70 px-4 py-3">
                {post.id}. {post.title}
              </li>
            ))}
          </ul>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
};

export default PostsListPage;
