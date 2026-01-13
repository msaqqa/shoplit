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
import { Plus, Trash2 } from "lucide-react";
import DataTablePagination from "@/components/admin/DataTablePagination";
import ConfirmDeleteDialog from "@/components/common/confirm-delete-dialog";
import { deleteOrder } from "@/app/actions/orders";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { TUsers } from "@/types/users";
import { TProducts } from "@/types/products";
import AddOrder from "@/components/admin/AddOrder";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  products: TProducts;
  users: TUsers;
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  data,
  products,
  users,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState(false);

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
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <SidebarMenuButton className="w-auto flex items-center gap-2 bg-blue-500 text-white px-2 py-1 text-sm rounded-md cursor-pointer">
                <Plus />
                <span>Add Order</span>
              </SidebarMenuButton>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
              <AddOrder
                onSuccess={() => setOpen(false)}
                products={products}
                users={users}
              />
            </SheetContent>
          </Sheet>
          {Object.keys(rowSelection).length > 0 && (
            <ConfirmDeleteDialog
              trigger={
                <button className="flex items-center gap-2 bg-red-500 text-white px-2 py-1 text-sm rounded-md cursor-pointer">
                  <Trash2 className="w-4 h-4" /> Delete category(s)
                </button>
              }
              title="Delete order?"
              description="This order will be permanently removed."
              onConfirm={async () => {
                const selectedOrderIds = table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original.id);
                await Promise.all(
                  selectedOrderIds.map((id) => deleteOrder(Number(id)))
                ).finally(() => setRowSelection({}));
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
                            header.getContext()
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
                        cell.getContext()
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
