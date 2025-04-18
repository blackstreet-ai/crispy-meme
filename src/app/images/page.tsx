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
      </div>
    </div>
  )
}
