import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageGenerator } from "@/components/ImageGenerator"

export default function ImagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Image Generation</h1>
        <p className="text-muted-foreground">
          Generate images using AI with text prompts
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Generate Image</CardTitle>
            <CardDescription>
              Enter a prompt to generate an image using fal.ai&apos;s Flux model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageGenerator />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Image Generation Tips</CardTitle>
            <CardDescription>
              How to write effective prompts for better results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Be Specific</h3>
                <p className="text-sm text-muted-foreground">
                  Include specific details about what you want to see in the image. 
                  The more specific your prompt, the better the results.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Describe Style</h3>
                <p className="text-sm text-muted-foreground">
                  Mention artistic styles like &quot;oil painting&quot;, &quot;digital art&quot;, 
                  &quot;photorealistic&quot;, or &quot;watercolor&quot; for more stylized results.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Add Context</h3>
                <p className="text-sm text-muted-foreground">
                  Include lighting conditions, time of day, or camera angles 
                  for more controlled results.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Example Prompts</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>&quot;A serene mountain landscape at sunset with a lake reflection, digital art&quot;</li>
                  <li>&quot;A futuristic city with flying cars and neon lights, cyberpunk style&quot;</li>
                  <li>&quot;A close-up portrait of a fox in the snow, photorealistic&quot;</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
