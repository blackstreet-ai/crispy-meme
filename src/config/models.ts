import { z } from 'zod';

// Schemas for model parameters and specs
type Parameter = z.infer<typeof ParameterSchema>;
export const ParameterSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'enum', 'integer', 'float', 'boolean']),
  description: z.string(),
  label: z.string().optional(),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
  enumValues: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});

export type ModelSpec = z.infer<typeof ModelSpecSchema>;
export const ModelSpecSchema = z.object({
  label: z.string(),
  parameters: z.array(ParameterSchema),
});

export const ModelsSchema = z.record(z.string(), ModelSpecSchema);

// Raw model definitions
const rawModels = {
  'fal-ai/flux/dev': {
    label: 'Flux (Dev)',
    parameters: [
      { name: 'prompt', type: 'string', description: 'The prompt to generate an image from.' },
      { name: 'image_size', type: 'enum', description: 'The size of the generated image.', default: 'landscape_4_3', enumValues: ['square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9'] },
      { name: 'num_inference_steps', type: 'integer', description: 'The number of inference steps to perform.', default: 28, min: 1, max: 50, step: 1 },
      { name: 'seed', type: 'integer', description: 'The seed for image generation.' },
      { name: 'guidance_scale', type: 'float', description: 'CFG (Classifier Free Guidance) scale.', default: 3.5, min: 1, max: 20, step: 0.1 },
      { name: 'sync_mode', type: 'boolean', description: 'Wait for image to be generated before returning.' },
      { name: 'num_images', type: 'integer', description: 'The number of images to generate.', default: 1, min: 1, max: 4, step: 1 },
      { name: 'enable_safety_checker', type: 'boolean', description: 'Enable the safety checker.', default: true },
    ],
  },
  'fal-ai/flux/schnell': {
    label: 'Flux (Schnell)',
    parameters: [
      { name: 'prompt', type: 'string', description: 'The prompt to generate an image from.' },
      { name: 'image_size', type: 'enum', description: 'The size of the generated image.', default: 'landscape_4_3', enumValues: ['square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9'] },
      { name: 'num_inference_steps', type: 'integer', description: 'The number of inference steps to perform.', default: 4, min: 1, max: 10, step: 1 },
      { name: 'seed', type: 'integer', description: 'The seed for image generation.' },
      { name: 'sync_mode', type: 'boolean', description: 'Wait for image to be generated before returning.' },
      { name: 'num_images', type: 'integer', description: 'The number of images to generate.', default: 1, min: 1, max: 4, step: 1 },
      { name: 'enable_safety_checker', type: 'boolean', description: 'Enable the safety checker.', default: true },
    ],
  },
};

// Validate and export model specs
export const MODEL_SPECS = ModelsSchema.parse(rawModels);

// Derive model options for UI
export const MODEL_OPTIONS = Object.entries(MODEL_SPECS).map(([value, spec]) => ({ value, label: spec.label }));
