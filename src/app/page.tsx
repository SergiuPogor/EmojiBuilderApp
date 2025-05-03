import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Paintbrush, Swords, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl font-bold text-center text-primary">
        Welcome to Pixel Emoji Battle!
      </h1>
      <p className="text-lg text-center text-muted-foreground max-w-xl">
        Unleash your creativity with emojis! Build stunning pixel art, share your masterpieces, and compete in daily challenges and head-to-head battles.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl pt-8">
        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paintbrush className="text-accent" />
              Create Art
            </CardTitle>
            <CardDescription>
              Use our 16x16 grid editor to craft your unique emoji creations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/create" passHref>
              <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                Start Creating
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-accent" />
              Daily Challenge
            </CardTitle>
            <CardDescription>
              Join the daily themed challenge and see how your art stacks up!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/challenge" passHref>
              <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                View Challenge
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Swords className="text-accent" />
              Battle Mode
            </CardTitle>
            <CardDescription>
              Vote for your favorite emoji art in exciting head-to-head battles. (Coming Soon!)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full" disabled>
              Enter Battle Arena
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
