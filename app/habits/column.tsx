"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";

export type Habit = {
	_id: string;
	userId: string;
	name: string;
	frequency: string;
	days: string[];
	time: string;
	description: string;
	archived: boolean;
	createdAt: string;
	updatedAt: string;
};

export const getColumns = (
	deleteHabit: (habitId: string, habitName: string) => void,
	deleteMultiple: (habitIds: string[]) => void
): ColumnDef<Habit>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
	},
	{
		accessorKey: "frequency",
		header: "Frequency",
	},
	{
		accessorKey: "days",
		header: "Days",
	},
	{
		id: "actions",
		header: ({ table }) => {
			const selectedRows = table.getSelectedRowModel().rows;
			const hasSelection = selectedRows.length > 0;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const [isModalOpen, setIsModalOpen] = useState(false);

			return (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="bg-background border-muted-foreground"
						>
							<DropdownMenuItem
								onClick={() => {
									setIsModalOpen(true);
									// const habitIds = selectedRows.map((row) => row.original._id);
									// deleteMultiple(habitIds);
									// table.resetRowSelection();
								}}
								className="text-red-500! cursor-pointer"
								disabled={!hasSelection}
							>
								Delete Selected ({selectedRows.length})
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Modal
            title="Delete Habits"
						open={isModalOpen}
						onClose={() => setIsModalOpen(!isModalOpen)}
					>
            Are you sure you want to delete the selected habits? This action cannot be undone.
						<Button
              className="mt-4 bg-red-500 hover:bg-red-600 border-red-700 text-background"
              onClick={() => {
                const habitIds = selectedRows.map((row) => row.original._id);
                deleteMultiple(habitIds);
                table.resetRowSelection();
              }}
            >Delete</Button>
					</Modal>
				</>
			);
		},
		cell: ({ row }) => {
			const habit = row.original;
			function handleDelete(habitId: string, habitName: string) {
				deleteHabit(habitId, habitName);
			}
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="bg-background border-muted-foreground"
					>
						<DropdownMenuItem className="cursor-pointer p-0">
							<Link
								href={`/habits/${habit._id}/edit`}
								className="w-full px-2 py-1.5 block"
							>
								Edit Habit
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleDelete(habit._id, habit.name)}
							className="text-red-500! cursor-pointer"
						>
							Delete Habit
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
