"use client";

import { Data, Field } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { DataTable } from "../table";
import { Button } from "../ui/button";

export interface StudentsDatasProps {
  data: Form & { datas: Data[] | null | undefined; fields: Field[] };
}

interface TableData {
  [key: string]: any;
}

const Students = ({ data }: { data: StudentsDatasProps }) => {
  const fieldLabelMap =
    data.fields?.reduce((acc: Record<string, string>, field: Field) => {
      acc[field.id] = field.label;
      return acc;
    }, {}) || {};

  const tableData: TableData[] =
    data.datas?.map((entry) => ({
      ...entry.data,
      createdAt: new Date(entry.createdAt).toLocaleString(),
    })) || [];

  const fieldKeys = tableData[0] ? Object.keys(tableData[0]) : [];

  const dynamicColumns: ColumnDef<TableData>[] = fieldKeys.map((key) => ({
    accessorKey: key,
    header: fieldLabelMap[key] || key, // Use label if exists
    cell: (info) => {
      const value = info.getValue();
      return typeof value === "boolean" ? (
        <Checkbox checked={value} disabled />
      ) : (
        <span>{String(value)}</span>
      );
    },
  }));

  const columns: ColumnDef<TableData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-[#4A90E2]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-[#4A90E2]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...dynamicColumns,
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Edit", row.original)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => console.log("Delete", row.original)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        {data.topic}
      </h2>
      <DataTable columns={columns} data={tableData} />
    </div>
  );
};

export default Students;
