import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { Controller } from "react-hook-form";

interface TextBoxProps<TForm extends FieldValues> {
  label: string;
  name: Path<TForm>;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  control?: Control<TForm>;
  errorMessage?: string;
  rules?: RegisterOptions<TForm, Path<TForm>>;
  type?: string;
}

export default function TextBox<TForm extends FieldValues>(
  props: TextBoxProps<TForm>
) {
  const {
    label,
    name,
    placeholder,
    value,
    onChange,
    disabled,
    control,
    errorMessage,
    rules,
    type = "text",
  } = props;

  return (
    <div className="mb-4">
      <label
        className="block text-slate-300 text-sm font-medium mb-1"
        htmlFor={name}
      >
        {label}
      </label>

      {control ? (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState }) => (
            <>
              <input
                {...field}
                value={field.value ?? ""}
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white 
                focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
              />
              <div className="text-red-500 text-sm mt-1">
                {fieldState.error?.message}
              </div>
            </>
          )}
        />
      ) : (
        <>
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white 
            focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          />
          {errorMessage && (
            <div className="text-red-500 text-sm mt-1">
              {errorMessage}
            </div>
          )}
        </>
      )}
    </div>
  );
}