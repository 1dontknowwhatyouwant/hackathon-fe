"use client";

import Button from "../button/Button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <Button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="h-10 w-10 p-0"
      >
        <span aria-hidden="true">‹</span>
      </Button>

      <ul className="flex items-center gap-2">
        {visiblePages.map((page) => (
          <li key={page}>
            <Button
              type="button"
              onClick={() => onPageChange(page)}
              active={page === currentPage}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Page ${page}`}
              className="h-10 min-w-10 px-3"
            >
              {page}
            </Button>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="h-10 w-10 p-0"
      >
        <span aria-hidden="true">›</span>
      </Button>
    </nav>
  );
};

export default Pagination;
