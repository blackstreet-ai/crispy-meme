'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { fal } from '@/lib/fal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const MODEL_OPTIONS = [
  { value: 'fal-ai/flux/dev', label: 'Flux (Dev)' },
  { value: 'fal-ai/flux/schnell', label: 'Flux (Schnell)' },
  // Add more models as needed
];

// Dynamic model specification mapping
type Parameter = { name: string; type: string; description: string; default?: string | number | boolean; enumValues?: string[]; };
type ModelSpec = { parameters: Parameter[]; };
const MODEL_SPECS: Record<string, ModelSpec> = {
  'fal-ai/flux/dev': {
    parameters: [
      { name: 'prompt', type: 'string', description: 'The prompt to generate an image from.' },
      { name: 'image_size', type: 'enum', description: 'The size of the generated image.', default: 'landscape_4_3', enumValues: ['square_hd','square','portrait_4_3','portrait_16_9','landscape_4_3','landscape_16_9'] },
      { name: 'num_inference_steps', type: 'integer', description: 'The number of inference steps to perform.', default: 28 },
      { name: 'seed', type: 'integer', description: 'The seed for image generation. Same seed and prompt yields the same image.' },
      { name: 'guidance_scale', type: 'float', description: 'CFG (Classifier Free Guidance) scale.', default: 3.5 },
      { name: 'sync_mode', type: 'boolean', description: 'Wait for image to be generated and uploaded before returning.' },
      { name: 'num_images', type: 'integer', description: 'The number of images to generate.', default: 1 },
      { name: 'enable_safety_checker', type: 'boolean', description: 'Enable the safety checker.', default: true },
    ],
  },
  'fal-ai/flux/schnell': {
    parameters: [
      { name: 'prompt', type: 'string', description: 'The prompt to generate an image from.' },
      { name: 'image_size', type: 'enum', description: 'The size of the generated image.', default: 'landscape_4_3', enumValues: ['square_hd','square','portrait_4_3','portrait_16_9','landscape_4_3','landscape_16_9'] },
      { name: 'num_inference_steps', type: 'integer', description: 'The number of inference steps to perform.', default: 4 },
      { name: 'seed', type: 'integer', description: 'The same seed and the same prompt given to the same version of the model will output the same image every time.' },
      { name: 'sync_mode', type: 'boolean', description: 'If set to true, waits for image generation and upload before returning.' },
      { name: 'num_images', type: 'integer', description: 'The number of images to generate.', default: 1 },
      { name: 'enable_safety_checker', type: 'boolean', description: 'If set to true, the safety checker will be enabled.', default: true },
    ],
  },
};

export function ImageGenerator() {
  // Prompt & result
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parameters
  const [model, setModel] = useState('fal-ai/flux/dev');
  const [imageSize, setImageSize] = useState('square_hd');
  const [steps, setSteps] = useState(28);
  const [cfg, setCfg] = useState(3.5);
  const [syncMode, setSyncMode] = useState(false);
  const [numImages, setNumImages] = useState(1);
  const [safetyChecker, setSafetyChecker] = useState(true);
  const [streaming, setStreaming] = useState(true);
  const [seed, setSeed] = useState('');

  // Dynamic spec state for selected model
  const [spec, setSpec] = useState<ModelSpec | null>(MODEL_SPECS[model] || null);
  // Derive imageSize options from spec
  const imageSizeOptions = spec?.parameters.find(p => p.name === 'image_size')?.enumValues?.map(v => ({ value: v, label: v.split('_').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ') })) ?? [];

  useEffect(() => {
    const mSpec = MODEL_SPECS[model];
    setSpec(mSpec);
    if (mSpec) {
      mSpec.parameters.forEach(p => {
        if (p.default != null) {
          switch (p.name) {
            case 'num_inference_steps': setSteps(p.default as number); break;
            case 'guidance_scale': setCfg(p.default as number); break;
            case 'num_images': setNumImages(p.default as number); break;
            case 'image_size': setImageSize(p.default as string); break;
            case 'enable_safety_checker': setSafetyChecker(p.default as boolean); break;
          }
        }
      });
    }
  }, [model]);

  // Helpers
  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000).toString());
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const result = await fal.subscribe(model, {
        input: {
          prompt,
          image_size: imageSize,
          num_inference_steps: steps,
          guidance_scale: cfg,
          sync_mode: syncMode,
          num_images: numImages,
          enable_safety_checker: safetyChecker,
          streaming,
          seed: seed ? Number(seed) : undefined,
        },
        pollInterval: 2000,
        logs: true,
        onQueueUpdate() {
          // Optionally handle queue updates
        },
      });
      if (result.data?.images?.[0]?.url) {
        setImageUrl(result.data.images[0].url);
      } else {
        setError('No images were generated. Please try again.');
      }
    } catch {
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* Left: Image & Prompt */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative w-full aspect-square rounded-md overflow-hidden border border-border bg-muted/40 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Generated image"
              className="object-contain"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          ) : (
            <span className="text-muted-foreground text-sm">Generated image will appear here</span>
          )}
        </div>
        <div className="flex flex-row gap-2 items-end w-full">
          <Input
            type="text"
            placeholder="Enter a prompt for image generation..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={generateImage}
            disabled={isLoading || !prompt.trim()}
            className="h-10"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
        {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}
      </div>
      {/* Right: Parameter Controls */}
      <div className="w-full md:w-80 flex flex-col gap-4 bg-card border border-border rounded-xl p-6">
        <Select
          label="Model"
          options={MODEL_OPTIONS}
          value={model}
          onChange={setModel}
        />
        <Select
          label="Image Size"
          options={imageSizeOptions}
          value={imageSize}
          onChange={setImageSize}
          disabled={!imageSizeOptions.length}
        />
        <Slider
          label="Inference Steps"
          min={1}
          max={50}
          step={1}
          value={steps}
          onChange={setSteps}
        />
        <Slider
          label="CFG (Classifier Free Guidance)"
          min={1}
          max={20}
          step={0.1}
          value={cfg}
          onChange={setCfg}
        />
        <Switch
          label="Sync Mode"
          checked={syncMode}
          onCheckedChange={setSyncMode}
        />
        <Slider
          label="Number of Images"
          min={1}
          max={4}
          step={1}
          value={numImages}
          onChange={setNumImages}
        />
        <Switch
          label="Enable Safety Checker"
          checked={safetyChecker}
          onCheckedChange={setSafetyChecker}
        />
        <Switch
          label="Streaming"
          checked={streaming}
          onCheckedChange={setStreaming}
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Seed</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={seed}
              placeholder="Random"
              onChange={e => setSeed(e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={handleRandomSeed}>
              Random
            </Button>
          </div>
        </div>
        {/* Display API parameters for the selected model */}
        <div className="bg-card border border-border rounded-md p-4 text-sm">
          <h3 className="font-semibold mb-2">API Parameters</h3>
          {spec?.parameters.map(param => (
            <div key={param.name} className="mb-1">
              <span className="font-medium">{param.name}</span> (<span className="italic">{param.type}</span>){param.default != null && <span>: default {String(param.default)}</span>}
              <div className="text-muted-foreground">{param.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
