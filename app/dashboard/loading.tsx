import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return(
    <div className="space-y-4">
      <Skeleton className="h-28 w-full bg-muted-foreground/50 rounded-md animate-pulse" />
      <Skeleton className="h-28 w-full bg-muted-foreground/50 rounded-md animate-pulse" />
      <Skeleton className="h-28 w-full bg-muted-foreground/50 rounded-md animate-pulse" />
    </div>
  )
}