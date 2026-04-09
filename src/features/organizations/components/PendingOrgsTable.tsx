"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { approveOrganization } from "../actions/approve-org";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Search } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Organization = {
  id: string;
  name: string;
  location: string;
  description: string;
  createdAt: Date;
  creator: {
    id: string;
    username: string;
    email: string;
  };
};

interface PendingOrgsTableProps {
  organizations: Organization[];
}

export function PendingOrgsTable({ organizations }: Readonly<PendingOrgsTableProps>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (orgId: string, status: "ACTIVE" | "REJECTED") => {
    setProcessingId(orgId);
    const result = await approveOrganization(orgId, status);
    setProcessingId(null);

    if (result.success) {
      toast.success(status === "ACTIVE" ? "Organization approved" : "Organization rejected");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update organization");
    }
  };

  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: "name",
      header: "Organization Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-[#F0F0F0]">{row.original.name}</p>
          <p className="text-xs text-[#666666] mt-1">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <span className="text-[#AAAAAA]">{row.original.location}</span>,
    },
    {
      accessorKey: "creator.username",
      header: "Requested By",
      cell: ({ row }) => (
        <div>
          <p className="text-[#F0F0F0]">{row.original.creator.username}</p>
          <p className="text-xs text-[#666666]">{row.original.creator.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Requested On",
      cell: ({ row }) => (
        <span className="text-[#AAAAAA] text-sm">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handleApprove(row.original.id, "ACTIVE")}
            disabled={processingId === row.original.id}
            className="bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] hover:bg-[#1A5C30]"
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            onClick={() => handleApprove(row.original.id, "REJECTED")}
            disabled={processingId === row.original.id}
            className="bg-[#2E0D0D] text-[#F97C7C] border border-[#5C1A1A] hover:bg-[#5C1A1A]"
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: organizations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
          <Input
            placeholder="Search organizations..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]"
          />
        </div>
      </div>

      <div className="border border-[#2A2A2A] rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-[#2A2A2A] hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-[#AAAAAA] font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-[#2A2A2A] hover:bg-[#111111]"
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
                <TableCell colSpan={columns.length} className="h-24 text-center text-[#666666]">
                  No pending organizations
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
