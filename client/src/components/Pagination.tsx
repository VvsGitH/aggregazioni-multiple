import { Flex, Pagination as PaginationMantine } from "@mantine/core";

interface PaginationProps {
  offset: number;
  limit: number;
  count: number;
  onPageChange: (offset: number, limit: number) => void;
}

export function Pagination(props: PaginationProps) {
  const pageNum = Math.ceil(props.count / props.limit);
  const page = Math.ceil(props.offset / props.limit) + 1;

  const handleChange = (page: number) => {
    const newOffset = props.limit * (page - 1);
    props.onPageChange(newOffset, props.limit);
  };

  return (
    <Flex justify="flex-end">
      <PaginationMantine total={pageNum} value={page} onChange={handleChange} withEdges />
    </Flex>
  );
}
