'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import { fal } from '@/lib/fal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { MODEL_OPTIONS, MODEL_SPECS } from '@/config/models';

// form data type
type FormData = Record<string, string | number | boolean>;

export function ImageGenerator() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState(MODEL_OPTIONS[0].value);
  const spec = MODEL_SPECS[model];
  const [streaming, setStreaming] = useState(true);

  // React Hook Form setup
  const defaultValues = spec.parameters.reduce((acc, p) => {
    let def: string | number | boolean;
    if (p.default != null) def = p.default;
    else if (p.type === 'boolean') def = false;
    else if (p.type === 'string') def = '';
    else if (p.type === 'enum') def = p.enumValues && p.enumValues.length ? p.enumValues[0] : '';
    else /* integer or float */ def = p.min ?? 0;
    return { ...acc, [p.name]: def };
  }, {} as FormData);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ defaultValues });
  // reset form defaults when model spec changes
  useEffect(() => {
    const defaults = spec.parameters.reduce<FormData>((acc, p) => {
      let def: string | number | boolean;
      if (p.default != null) def = p.default;
      else if (p.type === 'boolean') def = false;
      else if (p.type === 'string') def = '';
      else if (p.type === 'enum') def = p.enumValues && p.enumValues.length ? p.enumValues[0] : '';
      else def = p.min ?? 0;
      return { ...acc, [p.name]: def };
    }, {} as FormData);
    reset(defaults);
  }, [spec, reset]);
  const onSubmit = async (data: FormData) => {
    setIsLoading(true); setError(null); setImageUrls([]);
    try {
      const input = { ...data, streaming };
      const result = await fal.subscribe(model, { input, pollInterval: 2000, logs: true });
      const urls = result.data?.images
        ?.map((img: { url?: string }) => img.url)
        .filter((url: string | undefined): url is string => Boolean(url)) ?? [];
      setImageUrls(urls);
      if (urls.length === 0) throw new Error();
    } catch {
      setError('Failed to generate image. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col md:flex-row gap-8">
      {/* Left: Image & Prompt */}
      <div className="flex-1 flex flex-col gap-6">
        {isLoading ? (
          <div className="h-[300px] bg-muted animate-pulse rounded-md" />
        ) : imageUrls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative w-full aspect-square rounded-md overflow-hidden border border-border bg-muted/40">
                <Image src={url} alt={`Generated ${idx + 1}`} fill className="object-contain" priority />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative w-full aspect-square rounded-md overflow-hidden border border-border bg-muted/40 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Generated image will appear here</span>
          </div>
        )}
        <div className="flex flex-row gap-2 items-end w-full">
          <Controller
            name="prompt"
            control={control}
            rules={{ required: 'Prompt required' }}
            render={({ field }) => {
              const { value, onChange, onBlur, name, ref } = field;
              return (
                <Input
                  value={value as string}
                  onChange={onChange}
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                  placeholder="Enter a prompt..."
                  disabled={isLoading}
                  className="flex-1"
                />
              );
            }}
          />
          <Button type="submit" disabled={isLoading || !!errors.prompt} className="h-10">{isLoading ? 'Generating...' : 'Generate'}</Button>
        </div>
        {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}
      </div>
      {/* Right: Parameter Controls */}
      <fieldset disabled={isLoading} className="w-full md:w-80">
        <div className="flex flex-col gap-4 bg-card border border-border rounded-xl p-6">
          <Select label="Model" options={MODEL_OPTIONS} value={model} onChange={setModel} />
          {/* Auto-generate controls based on spec */}
          {spec.parameters.filter(p => p.name !== 'prompt').map(param => {
            const label = param.name.split('_').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
            return <div key={param.name} className="w-full">{
              param.type === 'enum' ? (
                <Controller
                  name={param.name}
                  control={control}
                  render={({ field }) => (
                    <Select
                      label={label}
                      options={param.enumValues!.map(v => ({ value: v, label: v }))}
                      value={field.value as string}
                      onChange={field.onChange}
                    />
                  )}
                />
              ) : param.type === 'integer' || param.type === 'float' ? (
                param.min != null ? (
                  <Controller
                    name={param.name}
                    control={control}
                    render={({ field }) => (
                      <Slider
                        label={label}
                        min={param.min!}
                        max={param.max!}
                        step={param.step!}
                        value={field.value as number}
                        onChange={field.onChange}
                      />
                    )}
                  />
                ) : (
                  <Controller
                    name={param.name}
                    control={control}
                    render={({ field }) => {
                      const { value, onChange, onBlur, name, ref } = field;
                      return (
                        <Input
                          value={value as number}
                          onChange={e => onChange(Number(e.target.value))}
                          onBlur={onBlur}
                          name={name}
                          ref={ref}
                          type="number"
                          placeholder={label}
                          disabled={isLoading}
                          className="w-full"
                        />
                      );
                    }}
                  />
                )
              ) : param.type === 'boolean' ? (
                <Controller
                  name={param.name}
                  control={control}
                  render={({ field }) => (
                    <Switch
                      label={label}
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              ) : null
            }</div>;
          })}
          {/* Streaming separate control */}
          <div><Switch label="Streaming" checked={streaming} onCheckedChange={setStreaming} /></div>
          {/* Display API parameters */}
          <div className="bg-card border border-border rounded-md p-4 text-sm">
            <h3 className="font-semibold mb-2">API Parameters</h3>
            {spec.parameters.map(p => (
              <div key={p.name} className="mb-1">
                <span className="font-medium">{p.name}</span> (<span className="italic">{p.type}</span>){p.default!=null && <span>: default {String(p.default)}</span>}
                <div className="text-muted-foreground">{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      </fieldset>
    </form>
  );
}
