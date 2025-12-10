"use client";

interface Props {
  label: string;
  description?: string;
  checked?: boolean;
}

export default function Toggle({ label, description, checked = true }: Props) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-primary text-base font-medium">{label}</h2>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" defaultChecked={checked} className="peer sr-only" />
        <div className="border-2 border-muted-foreground transition peer h-7 w-12 rounded-full bg-muted
            after:absolute after:start-1 after:top-1
            after:h-5 after:w-5 after:rounded-full
            after:bg-primary after:transition-all
            peer-checked:bg-muted-foreground peer-checked:after:translate-x-full peer-checked:after:border-white">
        </div>
      </label>
    </div>
  );
}
