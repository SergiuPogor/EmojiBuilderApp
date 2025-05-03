'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Send, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function ChallengePage() {
  const { toast } = useToast();
  const [dailyTheme, setDailyTheme] = useState<string>('');
  const [submission, setSubmission] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Renamed from isLoading
  const [submitted, setSubmitted] = useState<boolean>(false); // Track submission status

  // Simulate fetching the daily theme
  useEffect(() => {
    // In a real app, fetch this from Firestore/backend
    const themes = ["Make a 🌵 cactus!", "Design a 🚀 rocket ship!", "Create a delicious 🍕 pizza slice!", "Build a spooky 👻 ghost!", "Craft a sunny ☀️ day scene!"];
    const today = new Date().getDate(); // Simple way to get a varying theme daily
    setDailyTheme(themes[today % themes.length]);
  }, []);

  const handleSubmit = async () => {
    if (!submission.trim()) {
      toast({
        title: "Submission Empty",
        description: "Please describe your emoji art before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true); // Indicate submission process start
    setSubmitted(false);

    // Simulate submission process (e.g., saving to Firestore)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you would save the submission description and link to the art here.
    console.log('Submitting:', { theme: dailyTheme, description: submission });

    setIsSubmitting(false);
    setSubmitted(true);
    toast({
      title: "Submission Received!",
      description: "Your entry for the daily challenge has been submitted.",
    });
    // Optionally clear the textarea after submission
    // setSubmission('');
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold text-primary">Daily Emoji Challenge</h1>

      <Card className="w-full max-w-2xl bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-accent" />
            Today's Theme
          </CardTitle>
          <CardDescription className="text-lg font-semibold pt-2">
            {dailyTheme || 'Loading theme...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Describe the emoji art you created based on today's theme.
            (Note: In a full app, you'd link this to your actual saved art).
          </p>
          <Textarea
            placeholder="Describe your emoji masterpiece here..."
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            rows={4}
            className="bg-background focus:ring-primary"
            disabled={isSubmitting || submitted} // Disable if submitting or already submitted
          />
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
          <Button
             onClick={handleSubmit}
             disabled={isSubmitting || submitted || !submission.trim()}
             className="w-full bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
               <>
                 <Send className="mr-2 h-4 w-4 animate-pulse" /> Submitting...
               </>
             ) : submitted ? (
               <>
                  <Check className="mr-2 h-4 w-4" /> Submitted!
               </>
             ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit Entry
              </>
            )}
          </Button>

          {/* Removed AI Judge Result Card */}

        </CardFooter>
      </Card>

      <div className="w-full max-w-2xl mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center text-primary">Challenge Leaderboard</h2>
          <p className="text-center text-muted-foreground">(Coming Soon!)</p>
          {/* Placeholder for leaderboard display */}
      </div>

    </div>
  );
}
