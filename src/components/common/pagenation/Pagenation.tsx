import { useEffect } from "react";
import axios from "axios";
import { usePaginationStore } from "../../../stores/usePagination.store";
import Button from "../button/Button";
import { PaginationContainer, PaginationIcon } from "./PaginationStyles";
import { GrNext, GrPrevious } from "react-icons/gr";

const Pagination = () => {
  const {
    currentPage,
    postPerPage,
    maxPageNum,
    pageActiveIdx,
    isLoading,
    error,
    posts,
    setCurrentPage,
    setPageActiveIdx,
    setIsLoading,
    setPosts,
  } = usePaginationStore();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts",
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const pageCount = Math.ceil(posts.length / postPerPage);
  const postsNumber = Array.from({ length: pageCount }, (_, i) => i + 1);

  const totalPageCount = Math.ceil(pageCount / maxPageNum);
  const startNum = pageActiveIdx * maxPageNum;
  const endNum = startNum + maxPageNum;
  const pageNationNumbers = postsNumber.slice(startNum, endNum);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PaginationContainer>
      {pageActiveIdx > 0 && (
        <PaginationIcon>
          <GrPrevious onClick={() => setPageActiveIdx(pageActiveIdx - 1)} />
        </PaginationIcon>
      )}
      {pageNationNumbers.map((number) => (
        <Button
          width="30px"
          height="30px"
          fontColor="black"
          borderRadius="50%"
          border="1px solid #333"
          margin="0 3px"
          backgroundColor="white"
          key={number}
          isActive={currentPage === number}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Button>
        // <button
        //   key={number}
        //   onClick={() => setCurrentPage(number)}
        //   style={{ fontWeight: currentPage === number ? 'bold' : 'normal' }}
        // >
        //   {number}
        // </button>
      ))}
      {pageActiveIdx < totalPageCount - 1 && (
        <PaginationIcon>
          <GrNext onClick={() => setPageActiveIdx(pageActiveIdx + 1)} />
        </PaginationIcon>
      )}
    </PaginationContainer>
  );
};

export default Pagination;
