import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectProps {
  onValueChange: (value: any) => void;
  options: OptionProps[];
  placeholder?: string;
  defaultValue?: string;
  value?: string;
}

export function CustomSelect({
  onValueChange,
  options,
  placeholder,
  defaultValue,
  value,
}: SelectProps) {
  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      value={value}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option: OptionProps) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label.charAt(0).toUpperCase() + option.label.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
