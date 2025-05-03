'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Send, Loader2, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { judgeSubmission, type JudgeSubmissionInput, type JudgeSubmissionOutput } from '@/ai/flows/daily-challenge-judge'; // Import AI function

export default function ChallengePage() {
  const { toast } = useToast();
  const [dailyTheme, setDailyTheme] = useState<string>('');
  const [submission, setSubmission] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<JudgeSubmissionOutput | null>(null);

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

    setIsLoading(true);
    setResult(null);

    try {
      const input: JudgeSubmissionInput = {
        artDescription: submission,
        challengeTheme: dailyTheme,
      };
      const aiResult = await judgeSubmission(input);
      setResult(aiResult);
      toast({
        title: "Submission Judged!",
        description: `Your score: ${aiResult.score}/100`,
      });
    } catch (error) {
      console.error("AI Judging Error:", error);
      toast({
        title: "Judging Failed",
        description: "Could not get a score from the AI judge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            Describe the emoji art you created based on today's theme. The AI Judge will score your submission!
            (Note: In a full app, you'd link this to your actual saved art).
          </p>
          <Textarea
            placeholder="Describe your emoji masterpiece here..."
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            rows={4}
            className="bg-background focus:ring-primary"
            disabled={isLoading}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
          <Button onClick={handleSubmit} disabled={isLoading || !submission.trim()} className="w-full bg-primary hover:bg-primary/90">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Judging...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit for Judging
              </>
            )}
          </Button>

          {result && (
            <Card className="mt-4 border-accent bg-accent/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                   <Star className="text-primary" /> AI Judge's Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-4xl font-bold text-center text-primary mb-2">{result.score}<span className="text-lg text-muted-foreground">/100</span></p>
                 <p className="text-sm text-muted-foreground italic">"{result.justification}"</p>
              </CardContent>
            </Card>
          )}
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
