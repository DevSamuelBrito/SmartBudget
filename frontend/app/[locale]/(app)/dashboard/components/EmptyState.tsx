// components
import type { LucideProps } from "lucide-react";

type EmptyStateProps = {
    icon: React.ComponentType<LucideProps>;
    title: string;
    description: string;
};

export function EmptyState({ icon: Icon, title, description }: Readonly<EmptyStateProps>) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="rounded-full bg-muted p-4 text-muted-foreground">
                <Icon className="size-8" />
            </div>
            <div className="space-y-1">
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
