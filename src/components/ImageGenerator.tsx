'use client';

import { useState } from 'react';
import Image from 'next/image';
import { fal } from '@/lib/fal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the fal.subscribe method according to the documentation
      const result = await fal.subscribe('fal-ai/flux/dev', {
        input: {
          prompt,
          image_size: 'square_hd',
        },
        pollInterval: 5000,
        logs: true,
        onQueueUpdate(update) {
          console.log('Queue update:', update);
        },
      });
      
      // Access the data property which contains the model output
      if (result.data?.images?.[0]?.url) {
        setImageUrl(result.data.images[0].url);
      } else {
        setError('No images were generated. Please try again.');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter a prompt for image generation..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
          <Button 
            onClick={generateImage} 
            disabled={isLoading || !prompt.trim()}
            className="w-full"
            variant="default"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </Button>
        </div>
        
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>
        )}
      </div>
      
      {imageUrl ? (
        <div className="relative w-full aspect-square rounded-md overflow-hidden border border-border">
          <Image 
            src={imageUrl} 
            alt="Generated image" 
            className="object-contain" 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      ) : (
        <div className="relative w-full aspect-square rounded-md border border-dashed border-border flex items-center justify-center bg-muted/40">
          <p className="text-muted-foreground text-sm">Generated image will appear here</p>
        </div>
      )}
    </div>
  );
}
