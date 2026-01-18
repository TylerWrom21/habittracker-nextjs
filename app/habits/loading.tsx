import { Skeleton } from "@/components/ui/skeleton";

export default function HabitsLoading() {
  return(
    <div className="space-y-6 mx-auto">
      <Skeleton className="min-h-24" />
      <Skeleton className="min-h-64" />
      <Skeleton className="min-h-64" />
    </div>
  )
}