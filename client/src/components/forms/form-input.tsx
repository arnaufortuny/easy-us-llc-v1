import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal" | "url" | "search" | "none";
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  inputMode,
  autoComplete,
  disabled = false,
  className = "",
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-xs md:text-sm font-bold text-foreground">
            {label}
          </FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <Input
              {...field}
              type={type}
              inputMode={inputMode}
              placeholder={placeholder}
              autoComplete={autoComplete || (type === "password" ? "current-password" : type === "email" ? "email" : undefined)}
              disabled={disabled}
              className="rounded-full h-11 md:h-12 px-5 border-2 border-border dark:border-[#1a3a2a] focus:border-accent bg-white dark:bg-[#112B1E] transition-colors font-medium text-foreground dark:text-white text-base placeholder:text-muted-foreground"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
