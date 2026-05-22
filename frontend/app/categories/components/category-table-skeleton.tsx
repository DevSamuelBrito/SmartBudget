// ui
import { Skeleton } from "@/components/ui/skeleton";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const skeletonRows = Array.from({ length: 5 });

export function CategoryTableSkeleton() {
    return (
        <div className="rounded-xl border">
            <div className="max-h-[60vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-24">Icone</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead className="w-28">Ações</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {skeletonRows.map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Skeleton className="size-8 rounded-md" />
                                </TableCell>

                                <TableCell>
                                    <Skeleton className="h-4 w-40" />
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="size-8 rounded-md" />
                                        <Skeleton className="size-8 rounded-md" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}