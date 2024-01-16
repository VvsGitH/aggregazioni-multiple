import { Dispatch, SetStateAction } from "react";
import { ActionIcon, Flex, MultiSelect, Select } from "@mantine/core";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";
import { IFilterQuery } from "../../types";

const groupByFieldList = [
  { value: "project.name", label: "Project" },
  { value: "employee.name", label: "Employee" },
  { value: "date", label: "Date" },
];
const orderByFieldList = [...groupByFieldList, { value: "hours", label: "Hours" }];

interface FilterFormProps {
  filter: Required<IFilterQuery>;
  onChange: Dispatch<SetStateAction<Required<IFilterQuery>>>;
}

export function FilterForm({ filter, onChange }: FilterFormProps) {
  return (
    <form role="search" onSubmit={(e) => e.preventDefault()}>
      <Flex justify="flex-start" gap="xl">
        <MultiSelect
          label="Group by"
          placeholder="Choose one or more fields"
          data={groupByFieldList}
          value={filter.groupBy as string[]}
          onChange={(selection) => onChange((curr) => ({ ...curr, groupBy: selection, offset: 0 }))}
          maw={400}
          clearable
        />

        <Flex role="group" justify="flex-start" align="flex-end" gap="xs">
          <Select
            label="Order by"
            placeholder="Choose one field"
            data={orderByFieldList}
            value={filter.orderBy}
            onChange={(sel) => onChange((curr) => ({ ...curr, orderBy: sel || "" }))}
            maw={200}
            clearable
          />

          <ActionIcon
            color="gray"
            variant="outline"
            title={`Sort direction: ${filter.orderDir || "asc"}`}
            disabled={!filter.orderBy}
            onClick={() =>
              onChange((curr) => ({ ...curr, orderDir: curr.orderDir == "desc" ? "asc" : "desc" }))
            }
            mb={7}
          >
            {filter.orderDir === "desc" ? <IconCaretDown /> : <IconCaretUp />}
          </ActionIcon>
        </Flex>
      </Flex>
    </form>
  );
}
