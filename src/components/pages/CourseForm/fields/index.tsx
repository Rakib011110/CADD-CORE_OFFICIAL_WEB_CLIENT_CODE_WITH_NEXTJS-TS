"use client";

import * as React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Loader2, Plus, Trash2 } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/form";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Button } from "@/components/UI/button";
import { Switch } from "@/components/UI/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

type BaseProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
};

function RequiredMark({ required }: { required?: boolean }) {
  if (!required) return null;
  return <span className="text-destructive"> *</span>;
}

export function TextField({
  name,
  label,
  placeholder,
  description,
  required,
  type = "text",
}: BaseProps & { type?: string }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              <RequiredMark required={required} />
            </FormLabel>
          )}
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TextareaField({
  name,
  label,
  placeholder,
  description,
  required,
  rows = 4,
}: BaseProps & { rows?: number }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              <RequiredMark required={required} />
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              rows={rows}
              placeholder={placeholder}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function NumberField({ name, label, placeholder, required }: BaseProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              <RequiredMark required={required} />
            </FormLabel>
          )}
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              value={field.value ?? 0}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? 0 : Number(e.target.value))
              }
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function SelectField({
  name,
  label,
  placeholder,
  required,
  options,
}: BaseProps & { options: { value: string; label: string }[] }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              <RequiredMark required={required} />
            </FormLabel>
          )}
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function SwitchField({ name, label }: BaseProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center gap-2">
          <FormControl>
            <Switch
              checked={!!field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-red-600"
            />
          </FormControl>
          {label && <FormLabel className="!mt-0">{label}</FormLabel>}
        </FormItem>
      )}
    />
  );
}

export function ImageUploadField({ name, label, required }: BaseProps) {
  const { control } = useFormContext();
  const [uploading, setUploading] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              <RequiredMark required={required} />
            </FormLabel>
          )}
          <div className="flex items-center gap-3">
            {field.value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={field.value}
                alt="preview"
                className="h-16 w-16 rounded-md border object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-md border bg-gray-50 text-[10px] text-gray-400">
                No image
              </div>
            )}
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                disabled={uploading}
                className="max-w-xs"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  const url = await uploadToCloudinary(file);
                  setUploading(false);
                  if (url) field.onChange(url);
                }}
              />
            </FormControl>
            {uploading && <Loader2 className="h-4 w-4 animate-spin text-red-600" />}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/**
 * Generic array section: renders an Add button and a removable card per item.
 * `renderItem(index)` should render field components using `${name}.${index}.<field>` names.
 */
export function RepeaterField({
  name,
  title,
  addLabel,
  newItem,
  emptyHint = "কোনো আইটেম যোগ করা হয়নি।",
  renderItem,
}: {
  name: string;
  title: string;
  addLabel: string;
  newItem: Record<string, unknown>;
  emptyHint?: string;
  renderItem: (index: number) => React.ReactNode;
}) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(newItem)}
        >
          <Plus className="h-4 w-4" /> {addLabel}
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-gray-400">{emptyHint}</p>
      )}

      <div className="space-y-3">
        {fields.map((f, index) => (
          <div
            key={f.id}
            className="relative rounded-lg border bg-gray-50/60 p-4 pr-12"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-red-600 hover:bg-red-50"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {renderItem(index)}
          </div>
        ))}
      </div>
    </div>
  );
}
