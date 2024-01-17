import { useMemo } from "react";
import { CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Center, Loader, Paper, Table, Text } from "@mantine/core";
import { IRegisteredActivity } from "../../types";
import { formatDate } from "../../utils";

interface ActivityTableProps {
  data: IRegisteredActivity[];
  groupBy: string[];
  loading?: boolean;
  error?: Error;
}

export function ActivityTable(props: ActivityTableProps) {
  const columns = useMemo<ColumnDef<IRegisteredActivity>[]>(() => {
    const defaultCols = [
      { header: "Employee", accessorKey: "employee.name" },
      { header: "Project", accessorKey: "project.name" },
      {
        header: "Date",
        accessorKey: "date",
        cell: (ctx: CellContext<IRegisteredActivity, unknown>) => formatDate(ctx.getValue<string>())
      },
      { header: "Hours", accessorKey: "hours" }
    ];

    if (!props.groupBy.length) {
      return defaultCols;
    } else {
      return [
        ...props.groupBy
          .map((groupField) => defaultCols.find((col) => col.accessorKey === groupField)!)
          .filter(Boolean),
        defaultCols.at(-1)!
      ];
    }
  }, [props.groupBy]);

  const table = useReactTable({
    data: props.data,
    columns: columns,
    getCoreRowModel: getCoreRowModel()
  });

  if (props.loading) {
    return (
      <Paper shadow="none" withBorder>
        <Center h={250}>
          <Loader color="blue" />
        </Center>
      </Paper>
    );
  }

  if (props.error) {
    return (
      <Paper shadow="none" withBorder>
        <Center h={250}>
          <Text>The following error happened during the loading of the data: '{props.error.message}'.</Text>
        </Center>
      </Paper>
    );
  }

  if (!props.data.length) {
    return (
      <Paper shadow="none" withBorder>
        <Center h={250}>
          <Text>The list of available activities is empty.</Text>
        </Center>
      </Paper>
    );
  }

  return (
    <Table.ScrollContainer minWidth={500} h={250}>
      <Table withColumnBorders withTableBorder striped>
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
