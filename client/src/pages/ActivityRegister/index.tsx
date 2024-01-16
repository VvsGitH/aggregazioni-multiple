import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Container, Space, Title } from "@mantine/core";
import { getActivities } from "../../api/activity-register";
import { IFilterQuery } from "../../types";
import { Pagination } from "../../components/Pagination";
import { FilterForm } from "./FilterForm";
import { ActivityTable } from "./ActivityTable";

export default function ActivityRegister() {
  const [filter, setFilter] = useState<Required<IFilterQuery>>({
    offset: 0,
    limit: 5,
    groupBy: [],
    orderBy: "hours",
    orderDir: "desc"
  });

  const query = useQuery({
    queryKey: ["activity-register", filter],
    queryFn: () => getActivities(filter),
    placeholderData: (previousData, query) => (query?.state.error ? undefined : previousData),
    refetchOnWindowFocus: false,
    retry: 1
  });

  return (
    <Container size="lg">
      <Title order={1} mt={100} mb={50}>
        Activity Register
      </Title>

      <FilterForm filter={filter} onChange={setFilter} />
      <Space h="xl" />

      <ActivityTable
        data={query.data?.data || []}
        loading={query.isPending}
        error={query.error || undefined}
        groupBy={filter.groupBy as string[]}
      />
      <Pagination
        count={query.data?.meta?.pagination?.count || 0}
        limit={filter.limit}
        offset={filter.offset}
        onPageChange={(offset, limit) => setFilter((curr) => ({ ...curr, offset, limit }))}
      />
    </Container>
  );
}
