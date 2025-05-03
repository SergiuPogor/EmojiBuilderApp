'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Trash2, Save, Share2, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const GRID_SIZE = 16;
const DEFAULT_EMOJI = '⬜️'; // White square as placeholder/empty

// Basic emoji palette (expandable)
const defaultEmojis = [
  '😀', '😂', '😍', '🥳', '😎', '😭', '🤔', '👍', '❤️', '🔥',
  '⭐️', '🎉', '💡', '🍎', '🍔', '⚽️', '🚗', '✈️', '🏠', '🌲',
  '☀️', '☁️', '💧', '🌊', '🌍', '🌝', '🌚', '🌵', '🌸', '🐶',
  '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁' // 40 Emojis
];

type GridState = string[][];

export default function CreatePage() {
  const { toast } = useToast();
  const initialGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(DEFAULT_EMOJI));
  const [grid, setGrid] = useState<GridState>(initialGrid);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('😀');
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);


  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[rowIndex][colIndex] = isEraser ? DEFAULT_EMOJI : selectedEmoji;
    setGrid(newGrid);
  };

  const handleCellHover = (rowIndex: number, colIndex: number) => {
    if (isDrawing) {
      handleCellClick(rowIndex, colIndex);
    }
  };

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true);
    handleCellClick(rowIndex, colIndex); // Also draw on initial click
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeaveGrid = () => {
    setIsDrawing(false); // Stop drawing if mouse leaves the grid area
  };

  const selectTool = (emoji: string) => {
    setSelectedEmoji(emoji);
    setIsEraser(false);
  };

  const activateEraser = () => {
    setIsEraser(true);
  };

  const clearGrid = () => {
    setGrid(initialGrid);
     toast({
        title: "Grid Cleared",
        description: "Started fresh with a blank canvas!",
      });
  };

  const saveArt = async () => {
    // In a real app, save to Firestore and generate image/URL here
    console.log('Saving art:', JSON.stringify(grid));
    // Simulate saving and getting a URL
    const generatedUrl = `/art/example-${Date.now()}`;
    setShareUrl(generatedUrl);
     toast({
        title: "Art Saved!",
        description: "Your emoji masterpiece is saved.",
        action: (
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedUrl)}>
            Copy Link
          </Button>
        ),
      });
  };

  const copyToClipboard = (text: string | null) => {
    if (!text) return;
    navigator.clipboard.writeText(`${window.location.origin}${text}`)
      .then(() => {
        toast({
          title: "Link Copied!",
          description: "Shareable link copied to clipboard.",
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Copy Failed",
          description: "Could not copy the link.",
          variant: "destructive",
        });
      });
  };


  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Editor Grid */}
      <Card className="flex-grow bg-card shadow-lg">
        <CardHeader>
          <CardTitle>Emoji Canvas</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={gridRef}
            className="grid border border-border rounded-md overflow-hidden bg-background"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              width: '100%',
              aspectRatio: '1 / 1', // Maintain square aspect ratio
              cursor: isEraser ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'lucide lucide-eraser\'><path d=\'M19.06 4.94a10 10 0 0 1 0 14.12L4.94 4.94a10 10 0 0 1 14.12 0Z\'/><path d=\'m21.12 6.06-5.06 5.06\'/></svg>") 12 12, auto' : `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18">${selectedEmoji}</text></svg>') 12 12, pointer`,
            }}
            onMouseLeave={handleMouseLeaveGrid} // Handle mouse leaving the grid container
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="flex items-center justify-center border-r border-b border-secondary last:border-r-0 group-last:border-b-0"
                  style={{
                    fontSize: '1.5vw', // Responsive emoji size based on viewport width
                    minWidth: '20px', // Ensure minimum size
                    minHeight: '20px',
                    lineHeight: 1,
                     aspectRatio: '1 / 1', // Ensure cell is square
                  }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                  onMouseEnter={() => handleCellHover(rowIndex, colIndex)} // Use MouseEnter for hover
                >
                  {cell}
                </div>
              ))
            )}
          </div>
        </CardContent>
         <CardFooter className="flex justify-end gap-2">
           <Button onClick={saveArt} variant="default" size="sm" className="bg-primary hover:bg-primary/90">
             <Save className="mr-2 h-4 w-4" /> Save
           </Button>
           {shareUrl && (
             <Button onClick={() => copyToClipboard(shareUrl)} variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10">
               <Share2 className="mr-2 h-4 w-4" /> Copy Link
             </Button>
           )}
        </CardFooter>
      </Card>

      {/* Toolbar */}
      <Card className="w-full lg:w-72 flex-shrink-0 bg-card shadow-lg">
         <CardHeader>
            <CardTitle>Tools</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                         <span className="text-2xl mr-2">{selectedEmoji}</span> Selected
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <ScrollArea className="h-48">
                        <div className="grid grid-cols-6 gap-1 p-2">
                          {defaultEmojis.map((emoji) => (
                            <Button
                              key={emoji}
                              variant={selectedEmoji === emoji && !isEraser ? 'secondary' : 'ghost'}
                              size="icon"
                              className="text-2xl"
                              onClick={() => selectTool(emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                 <Button
                    variant={isEraser ? 'secondary' : 'outline'}
                    size="icon"
                    onClick={activateEraser}
                    title="Eraser"
                    className={isEraser ? 'ring-2 ring-accent' : ''}
                  >
                    <Eraser className="h-5 w-5" />
                  </Button>

            </div>


            {/* Action Buttons */}
            <Button onClick={clearGrid} variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" /> Clear Grid
            </Button>

             {/* Premium Packs Placeholder */}
            <div className="border-t border-border pt-4 mt-4">
                 <h3 className="text-sm font-medium mb-2 text-muted-foreground">Premium Packs</h3>
                 <p className="text-xs text-muted-foreground">Unlock more emojis! (Coming Soon)</p>
                 {/* Add buttons for watching ads or purchasing later */}
             </div>
         </CardContent>

      </Card>


    </div>
  );
}
