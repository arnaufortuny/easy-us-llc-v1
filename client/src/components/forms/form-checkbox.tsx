import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  className?: string;
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  className = "",
}: FormCheckboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex items-start gap-3 p-4 rounded-[1.5rem] border border-border bg-white dark:bg-card hover:border-accent/30 cursor-pointer transition-all ${className}`}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="mt-1 border-gray-200 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
            />
          </FormControl>
          <span className="text-[10px] md:text-xs font-black text-primary">
            {label}
          </span>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
