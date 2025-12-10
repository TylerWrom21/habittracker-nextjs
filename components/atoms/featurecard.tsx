import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 p-6 border border-muted-foreground shadow-sm rounded-lg">
      <Icon className="w-10 h-10 text-primary" />
      <div className="flex flex-col gap-1">
        <h3 className="text-primary text-lg font-bold">{title}</h3>
        <p className="text-primary/70 text-sm">{description}</p>
      </div>
    </div>
  );
}