"use client";

import * as React from "react";

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Plus,
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    serverPagination?: {
        pageCount: number;
        pageIndex: number;
        pageSize: number;
        totalRows: number;
        onPageChange: (page: number) => void;
        onPageSizeChange: (pageSize: number) => void;
    }
}

export function DataTable<TData, TValue>({ 
    columns,
    data,
    serverPagination
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        getFilteredRowModel: getFilteredRowModel(),

        // Conditional pagination setup
        ...(serverPagination ? {
            // Server-side pagination setup
            manualPagination: true,
            pageCount: serverPagination.pageCount,
            // Use server values for current page and page size
            state: {
                pagination: {
                    pageIndex: serverPagination.pageIndex,
                    pageSize: serverPagination.pageSize
                }
            },
            // Override pagination functions to use server handlers
            onPaginationChange: (updater) => {
                // Extract page and pageSize from the updater
                const newPagination = typeof updater === "function" ? updater({
                    pageIndex: serverPagination.pageIndex,
                    pageSize: serverPagination.pageSize
                }) : updater;

                // Call the server handlers
                if (newPagination.pageIndex !== serverPagination.pageIndex) {
                    serverPagination.onPageChange(newPagination.pageIndex + 1);
                }
                if (newPagination.pageSize !== serverPagination.pageSize) {
                    serverPagination.onPageSizeChange(newPagination.pageSize);
                }
            }
        } : {
            // Client-side pagination
            getPaginationRowModel: getPaginationRowModel(),
            state: {
                sorting,
                columnFilters,
                rowSelection
            }
        })
    })

    return (
        <div>
        <div className="flex items-center justify-between py-4">
            <Input
            placeholder="Filter by product IDs..."
            value={(table.getColumn("product_id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("product_id")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <Button>
              <Plus/>
              Add Review
            </Button>
        </div>
          <div className="rounded-md border">
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
                      )
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                {serverPagination 
                    ? `${table.getFilteredSelectedRowModel().rows.length} of ${serverPagination.totalRows} row(s) selected.`
                    : `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected.`
                }
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value))
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
        </div>
      </div>
    )
}
