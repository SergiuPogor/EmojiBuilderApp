'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Flag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Placeholder grid rendering function (replace with actual data fetching/rendering)
const renderGrid = (size: number) => {
  const cells = [];
  for (let i = 0; i < size * size; i++) {
    // Random emoji for placeholder
    const emojis = ['😀', '😂', '😍', '🥳', '😎', '😭', '🤔', '👍', '❤️', '🔥', '⬜️'];
    cells.push(
      <div
        key={i}
        className="flex items-center justify-center border-r border-b border-secondary last:border-r-0 group-last:border-b-0"
        style={{
          fontSize: '1.2rem', // Adjust size as needed
          lineHeight: 1,
          aspectRatio: '1 / 1', // Ensure cell is square
        }}
      >
        {emojis[Math.floor(Math.random() * emojis.length)]}
      </div>
    );
  }
  return (
    <div
      className="grid border border-border rounded-md overflow-hidden bg-background"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        width: '100%',
        maxWidth: '400px', // Limit max width for display
        aspectRatio: '1 / 1',
      }}
    >
      {cells}
    </div>
  );
};


export default function ArtDisplayPage() {
  const params = useParams();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [artData, setArtData] = useState<any>(null); // Replace 'any' with your art data type

  // Simulate fetching data based on ID
  useEffect(() => {
     setIsLoading(true);
    // Replace with actual fetch call to Firestore using the 'id'
    const timer = setTimeout(() => {
        // Placeholder data structure
      setArtData({
        id: id,
        userId: 'user123',
        username: 'EmojiMaster',
        createdAt: new Date().toISOString(),
        likes: Math.floor(Math.random() * 100),
        gridSize: 16, // Assuming 16x16 grid
        // gridData: {} // Actual grid data would be fetched here
      });
      setIsLoading(false);
    }, 1500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [id]);


  const handleLike = () => {
    // Add like logic here (update Firestore, UI)
    console.log('Liked art:', id);
  };

  const handleShare = () => {
     const url = window.location.href;
     navigator.clipboard.writeText(url).then(() => {
         alert('Link copied to clipboard!');
     }).catch(err => {
         console.error('Failed to copy URL: ', err);
         alert('Failed to copy link.');
     });
  };

   const handleReport = () => {
     // Add report logic here (open modal, send report to Firestore)
    console.log('Reported art:', id);
    alert('Report functionality not implemented yet.');
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {isLoading ? (
         <Card className="w-full max-w-md bg-card shadow-lg">
           <CardHeader>
             <Skeleton className="h-6 w-3/4" />
             <Skeleton className="h-4 w-1/2 mt-2" />
           </CardHeader>
           <CardContent className="flex justify-center">
              <Skeleton className="w-full max-w-[400px] aspect-square rounded-md" />
           </CardContent>
           <CardFooter className="flex justify-between items-center">
             <Skeleton className="h-8 w-20" />
             <Skeleton className="h-8 w-20" />
             <Skeleton className="h-8 w-20" />
           </CardFooter>
         </Card>
      ) : artData ? (
        <Card className="w-full max-w-md bg-card shadow-lg">
          <CardHeader>
            <CardTitle>Emoji Art #{artData.id}</CardTitle>
             <CardDescription className="flex items-center gap-1 text-sm pt-1 text-muted-foreground">
              <User size={14} /> Created by {artData.username || 'Anonymous'} on {new Date(artData.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {/* Render the actual grid based on fetched artData.gridData */}
            {renderGrid(artData.gridSize)}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button onClick={handleLike} variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10">
              <Heart className="mr-2 h-4 w-4" /> Like ({artData.likes})
            </Button>
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
             <Button onClick={handleReport} variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
               <Flag className="mr-1 h-4 w-4" /> Report
             </Button>
          </CardFooter>
        </Card>
      ) : (
        <p className="text-destructive">Art not found.</p>
      )}

      {/* Voting/Battle Section Placeholder */}
      <div className="w-full max-w-md mt-8 text-center">
         <h2 className="text-xl font-semibold mb-2 text-primary">Vote!</h2>
         <p className="text-muted-foreground">(Battle mode coming soon!)</p>
      </div>
    </div>
  );
}
