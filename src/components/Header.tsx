'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Paintbrush, Trophy, Home } from 'lucide-react'; // Use specific icons

export default function Header() {
  return (
    <header className="bg-card text-card-foreground shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" passHref>
          <span className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity">
            Pixel Emoji Battle
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          <Link href="/" passHref>
             <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent/10">
               <Home className="mr-2 h-4 w-4" />
               Home
             </Button>
          </Link>
          <Link href="/create" passHref>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent/10">
              <Paintbrush className="mr-2 h-4 w-4" />
              Create
            </Button>
          </Link>
          <Link href="/challenge" passHref>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent/10">
              <Trophy className="mr-2 h-4 w-4" />
              Challenge
            </Button>
          </Link>
          {/* Add Auth buttons later */}
          {/* <Button variant="outline" size="sm">Login</Button> */}
        </div>
      </nav>
    </header>
  );
}
