'use client';

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  description?: string;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  description,
  options,
  required = false,
  disabled = false,
  className,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const error = errors[name];
  const value = watch(name);

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            disabled={disabled}
            onValueChange={(val) => setValue(name, val)}
            value={value}
          >
            <SelectTrigger className={cn(error && "border-destructive")}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'textarea':
        return (
          <Textarea
            {...register(name)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(error && "border-destructive")}
          />
        );

      case 'number':
        return (
          <Input
            {...register(name, { valueAsNumber: true })}
            type="number"
            placeholder={placeholder}
            disabled={disabled}
            className={cn(error && "border-destructive")}
          />
        );

      case 'date':
        return (
          <Input
            {...register(name)}
            type="date"
            placeholder={placeholder}
            disabled={disabled}
            className={cn(error && "border-destructive")}
          />
        );

      default:
        return (
          <Input
            {...register(name)}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(error && "border-destructive")}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderInput()}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
