'use client';

import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from "@/hooks/use-toast"
import {useRouter} from "next/navigation";

// Define a dummy function to simulate dream analysis and visualization.
const analyzeDreamDummy = async (dreamDescription: string) => {
  // Simulate dream interpretation.
  const dreamInterpretation = `This dream seems to revolve around themes of ${dreamDescription.substring(0, 20)}. It suggests a need for deeper exploration.`;

  // Simulate image generation URL.
  const imageUrl = `https://picsum.photos/512/512?random=${Math.random()}`;

  return {dreamInterpretation, imageUrl};
};

export default function Home() {
  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamInterpretation, setDreamInterpretation] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast()
  const router = useRouter()

  const handleDreamAnalysis = async () => {
    setIsLoading(true);
    try {
      const {dreamInterpretation, imageUrl} = await analyzeDreamDummy(dreamDescription);
      setDreamInterpretation(dreamInterpretation);
      setGeneratedImage(imageUrl);

      toast({
        title: "Dream analyzed!",
        description: "Your dream has been analyzed and visualized.",
      })
      router.refresh()
    } catch (error: any) {
      console.error('Error during dream analysis:', error);
      toast({
        title: "Error analyzing dream",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Dream Canvas</h1>

      <Card className="w-full max-w-md mb-4">
        <CardHeader>
          <CardTitle>Enter Your Dream</CardTitle>
          <CardDescription>Describe your dream in as much detail as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="I dreamt of..."
            value={dreamDescription}
            onChange={e => setDreamDescription(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleDreamAnalysis} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze Dream'}
          </Button>
        </CardContent>
      </Card>

      {dreamInterpretation && (
        <Card className="w-full max-w-md mb-4">
          <CardHeader>
            <CardTitle>Dream Interpretation</CardTitle>
            <CardDescription>Here&apos;s what your dream might mean.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{dreamInterpretation}</p>
          </CardContent>
        </Card>
      )}

      {generatedImage && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Dream Visualization</CardTitle>
            <CardDescription>A visual representation of your dream.</CardDescription>
          </CardHeader>
          <CardContent>
            <img src={generatedImage} alt="Dream visualization" className="w-full rounded-md" />
            <div className="flex justify-between mt-2">
              <Button variant="secondary">Regenerate</Button>
              <Button>Refine</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
