import { Input } from "../ui/input";

interface InputProps {
  label: string;
  required?: boolean;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export default function InputField({ label, required, value, onChange, placeholder, type }: InputProps) {
  return (
    <label className="flex flex-col w-full">
      <p className="text-primary text-xl font-semibold pb-2">{label}</p>
      <Input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg text-primary border border-muted-foreground transition hover:bg-muted/80
        h-14 px-4 font-bold placeholder:text-ring focus:outline-none"
      />
    </label>
  );
}
