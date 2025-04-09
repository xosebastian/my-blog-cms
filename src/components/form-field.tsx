import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  id: Path<T>; // Asegura que 'id' es una clave válida de T
  label: string;
  type: string;
  error?: string;
  register: UseFormRegister<T>; // Usamos el register según el tipo de formulario
}

export function FormField<T extends FieldValues>({
  id,
  label,
  type,
  error,
  register,
}: FormFieldProps<T>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...register(id)} />
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
