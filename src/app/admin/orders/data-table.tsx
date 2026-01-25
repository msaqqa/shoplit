"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import DataTablePagination from "@/components/admin/DataTablePagination";
import ConfirmDeleteDialog from "@/components/common/confirm-delete-dialog";
import { deleteOrder } from "@/app/actions/orders";
import AddOrder from "@/components/admin/AddOrder";
import { toast } from "react-toastify";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [showToast, setShowToast] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <div className="flex justify-end gap-2 p-4">
          <AddOrder tableBtn={true} />
          {Object.keys(rowSelection).length > 0 && (
            <ConfirmDeleteDialog
              trigger={
                <button className="flex items-center gap-2 bg-red-500 text-white px-2 py-1 text-sm rounded-md cursor-pointer">
                  <Trash2 className="w-4 h-4" /> Delete order(s)
                </button>
              }
              title="Delete order?"
              description="This order will be permanently removed."
              showToast={showToast}
              onConfirm={async () => {
                const selectedUserIds = table
                  .getSelectedRowModel()
                  .rows.map((row) => row?.original.id);
                const results = await Promise.all(
                  selectedUserIds.map((id) => deleteOrder(id)),
                );
                // Check and show the errors for each individual row
                let successCount = 0;
                results.map((res, index) => {
                  if ("error" in res && res.error) {
                    toast.error(
                      `Error deleting order ${index + 1}: ${res.error.message}`,
                    );
                  } else {
                    successCount++;
                  }
                });
                if (successCount > 0) setShowToast(true);
                setRowSelection({});
              }}
            />
          )}
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button> */}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
