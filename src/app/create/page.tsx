'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Square, Circle as CircleIcon, Eye, Smile, Trash2, Save, BringToFront, SendToBack, RotateCcw, RotateCw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

// Define element types and their properties
interface EmojiElement {
  id: string;
  type: 'base' | 'eye' | 'mouth' | 'accessory';
  shape: 'circle' | 'square' | 'simple-eye' | 'simple-smile'; // Add more shapes as needed
  color: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  zIndex: number;
}

// Predefined elements library
const elementLibrary = {
  base: [
    { type: 'base', shape: 'circle', color: '#FFD700', size: 100, name: 'Yellow Circle' }, // Gold-like yellow
    { type: 'base', shape: 'square', color: '#ADD8E6', size: 100, name: 'Light Blue Square' }, // Light blue
  ],
  eye: [
    { type: 'eye', shape: 'simple-eye', color: '#000000', size: 15, name: 'Simple Black Eye' },
  ],
  mouth: [
     { type: 'mouth', shape: 'simple-smile', color: '#000000', size: 30, name: 'Simple Black Smile' },
  ],
  accessory: [] // Add accessories later
};

// Generate unique IDs
let elementCounter = 0;
const generateId = () => `element-${Date.now()}-${elementCounter++}`;

export default function CreatePage() {
  const { toast } = useToast();
  const [composition, setComposition] = useState<EmojiElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 }); // Default or dynamic size
  const [draggingElement, setDraggingElement] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('#000000');

  // Update canvas size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const { clientWidth } = canvasRef.current;
        // Keep it square, use width for height as well, max 500
        const size = Math.min(clientWidth, 500);
        setCanvasSize({ width: size, height: size });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Add element to composition
  const addElement = (elementType: keyof typeof elementLibrary, elementTemplate: any) => {
    const newElement: EmojiElement = {
      ...elementTemplate,
      id: generateId(),
      x: canvasSize.width / 2 - elementTemplate.size / 2, // Center initially
      y: canvasSize.height / 2 - elementTemplate.size / 2,
      rotation: 0,
      zIndex: composition.length + 1, // Place on top
    };
    setComposition([...composition, newElement]);
    setSelectedElementId(newElement.id); // Select the new element
  };

  // Select element
  const handleSelectElement = (id: string, event: React.MouseEvent) => {
     event.stopPropagation(); // Prevent triggering canvas deselect
     setSelectedElementId(id);
  };

  // Deselect element when clicking on the canvas background
  const handleCanvasClick = () => {
      setSelectedElementId(null);
  };

  // Update element properties
  const updateElement = (id: string, updates: Partial<EmojiElement>) => {
    setComposition(comp =>
      comp.map(el => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // --- Dragging Logic ---
  const handleMouseDown = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const element = composition.find(el => el.id === id);
    if (!element) return;
    setSelectedElementId(id); // Select on drag start

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const startX = event.clientX - canvasRect.left;
    const startY = event.clientY - canvasRect.top;

    setDraggingElement({
      id: id,
      offsetX: startX - element.x,
      offsetY: startY - element.y,
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!draggingElement || !canvasRef.current) return;
    event.preventDefault(); // Prevent text selection during drag

    const canvasRect = canvasRef.current.getBoundingClientRect();
    let newX = event.clientX - canvasRect.left - draggingElement.offsetX;
    let newY = event.clientY - canvasRect.top - draggingElement.offsetY;

    // Constrain within canvas boundaries (optional, based on element size)
    // newX = Math.max(0, Math.min(canvasSize.width - (composition.find(el => el.id === draggingElement.id)?.size || 0), newX));
    // newY = Math.max(0, Math.min(canvasSize.height - (composition.find(el => el.id === draggingElement.id)?.size || 0), newY));


    updateElement(draggingElement.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDraggingElement(null);
  };

  const handleMouseLeave = () => {
     if (draggingElement) {
      setDraggingElement(null); // Stop dragging if mouse leaves canvas
     }
   };


  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    setComposition(comp => comp.filter(el => el.id !== selectedElementId));
    setSelectedElementId(null);
    toast({ title: "Element Removed" });
  };

  // Clear entire composition
  const clearComposition = () => {
    setComposition([]);
    setSelectedElementId(null);
    toast({ title: "Canvas Cleared" });
  };

  // Change element layer (z-index)
  const changeLayer = (direction: 'up' | 'down') => {
    if (!selectedElementId) return;
    const currentIndex = composition.findIndex(el => el.id === selectedElementId);
    if (currentIndex === -1) return;

    const newComposition = [...composition];
    const element = newComposition[currentIndex];

    if (direction === 'up' && currentIndex < newComposition.length - 1) {
      // Bring forward: Swap zIndex with the element above
      const elementAbove = newComposition[currentIndex + 1];
      [element.zIndex, elementAbove.zIndex] = [elementAbove.zIndex, element.zIndex];
    } else if (direction === 'down' && currentIndex > 0) {
      // Send backward: Swap zIndex with the element below
      const elementBelow = newComposition[currentIndex - 1];
       [element.zIndex, elementBelow.zIndex] = [elementBelow.zIndex, element.zIndex];
    }

    // Re-sort based on zIndex to maintain visual order
    newComposition.sort((a, b) => a.zIndex - b.zIndex);
    setComposition(newComposition);
  };

    // Rotate element
    const rotateElement = (direction: 'cw' | 'ccw') => {
        if (!selectedElementId) return;
        const currentElement = composition.find(el => el.id === selectedElementId);
        if (!currentElement) return;
        const rotationAmount = direction === 'cw' ? 15 : -15;
        updateElement(selectedElementId, { rotation: (currentElement.rotation + rotationAmount) % 360 });
    };


  // Save composition (placeholder)
  const saveComposition = () => {
     // In a real app, serialize 'composition' to JSON and save to Firestore.
     // Could also generate an SVG or PNG preview.
     console.log('Saving composition:', JSON.stringify(composition));
     toast({ title: "Composition Saved (Simulated)", description: "Check console for data." });
   };

  // Get selected element data for controls
  const selectedElement = composition.find(el => el.id === selectedElementId);


  // --- Rendering SVG Elements ---
  const renderElement = (element: EmojiElement) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.size}px`,
      height: `${element.size}px`,
      transform: `rotate(${element.rotation}deg)`,
      cursor: draggingElement?.id === element.id ? 'grabbing' : 'grab',
      zIndex: element.zIndex,
      outline: selectedElementId === element.id ? '2px dashed var(--accent)' : 'none',
       outlineOffset: '2px',
       userSelect: 'none', // Prevent text selection on elements
    };

    switch (element.shape) {
      case 'circle':
        return (
          <div
            key={element.id}
            style={style}
            onMouseDown={(e) => handleMouseDown(element.id, e)}
            onClick={(e) => handleSelectElement(element.id, e)}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block' }}>
              <circle cx="50" cy="50" r="50" fill={element.color} />
            </svg>
          </div>
        );
      case 'square':
         return (
            <div
             key={element.id}
             style={style}
             onMouseDown={(e) => handleMouseDown(element.id, e)}
             onClick={(e) => handleSelectElement(element.id, e)}
           >
             <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block' }}>
               <rect x="0" y="0" width="100" height="100" fill={element.color} />
             </svg>
           </div>
         );
      case 'simple-eye':
         return (
           <div
              key={element.id}
              style={style}
              onMouseDown={(e) => handleMouseDown(element.id, e)}
              onClick={(e) => handleSelectElement(element.id, e)}
            >
             <svg viewBox="0 0 20 20" width="100%" height="100%" style={{ display: 'block' }}>
               <circle cx="10" cy="10" r="8" fill={element.color} /> {/* Black part */}
                <circle cx="12" cy="8" r="2" fill="#FFFFFF" /> {/* White highlight */}
             </svg>
           </div>
         );
      case 'simple-smile':
        return (
           <div
             key={element.id}
             style={style}
             onMouseDown={(e) => handleMouseDown(element.id, e)}
             onClick={(e) => handleSelectElement(element.id, e)}
           >
             <svg viewBox="0 0 50 20" width="100%" height="100%" style={{ display: 'block' }}>
               <path d="M 5,10 Q 25,20 45,10" stroke={element.color} strokeWidth="3" fill="none" strokeLinecap="round" />
             </svg>
           </div>
        );
      // Add more cases for other shapes
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">

      {/* Emoji Composer Canvas */}
      <Card className="flex-grow bg-card shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle>Emoji Composer</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={canvasRef}
            className="relative border border-border rounded-md bg-background cursor-default overflow-hidden"
            style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave} // Add mouse leave handler
            onClick={handleCanvasClick} // Add canvas click handler for deselection
          >
            {composition.sort((a, b) => a.zIndex - b.zIndex).map(renderElement)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
           <Button onClick={saveComposition} variant="default" size="sm" className="bg-primary hover:bg-primary/90">
             <Save className="mr-2 h-4 w-4" /> Save
           </Button>
           {/* Add share button later */}
        </CardFooter>
      </Card>

      {/* Toolbar & Controls */}
      <Card className="w-full lg:w-80 flex-shrink-0 bg-card shadow-lg">
        <CardHeader>
          <CardTitle>Tools & Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="elements" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="controls" disabled={!selectedElementId}>Controls</TabsTrigger>
            </TabsList>

            {/* Elements Tab */}
            <TabsContent value="elements">
              <ScrollArea className="h-72 mt-2">
                <div className="space-y-3 p-1">
                  <div>
                    <h3 className="text-sm font-medium mb-1 text-muted-foreground">Base Shapes</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {elementLibrary.base.map((el, i) => (
                         <Button key={`base-${i}`} variant="outline" size="sm" className="flex-col h-auto p-2" onClick={() => addElement('base', el)}>
                           {el.shape === 'circle' && <CircleIcon className="h-6 w-6 mb-1" style={{ color: el.color }} />}
                           {el.shape === 'square' && <Square className="h-6 w-6 mb-1" style={{ color: el.color }}/>}
                           <span className="text-xs text-center">{el.name}</span>
                         </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1 text-muted-foreground">Eyes</h3>
                     <div className="grid grid-cols-3 gap-2">
                      {elementLibrary.eye.map((el, i) => (
                         <Button key={`eye-${i}`} variant="outline" size="sm" className="flex-col h-auto p-2" onClick={() => addElement('eye', el)}>
                            <Eye className="h-6 w-6 mb-1" />
                           <span className="text-xs text-center">{el.name}</span>
                         </Button>
                      ))}
                    </div>
                  </div>
                   <div>
                     <h3 className="text-sm font-medium mb-1 text-muted-foreground">Mouths</h3>
                     <div className="grid grid-cols-3 gap-2">
                       {elementLibrary.mouth.map((el, i) => (
                         <Button key={`mouth-${i}`} variant="outline" size="sm" className="flex-col h-auto p-2" onClick={() => addElement('mouth', el)}>
                           <Smile className="h-6 w-6 mb-1" />
                           <span className="text-xs text-center">{el.name}</span>
                         </Button>
                       ))}
                     </div>
                   </div>
                  {/* Add sections for Mouths, Accessories etc. */}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Controls Tab */}
            <TabsContent value="controls">
              {selectedElement ? (
                <div className="space-y-4 pt-2">
                   <p className="text-sm font-medium text-center">Editing: {selectedElement.type} ({selectedElement.shape})</p>
                  {/* Color Picker */}
                   <div className="flex items-center gap-2">
                     <Label htmlFor="color-picker" className="text-sm">Color:</Label>
                      <Input
                         id="color-picker"
                         type="color"
                         value={selectedElement.color}
                         onChange={(e) => updateElement(selectedElementId!, { color: e.target.value })}
                         className="w-16 h-8 p-0 border-none cursor-pointer"
                       />
                       {/* Quick Palette */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" title="Color Palette">
                                    <Palette />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2">
                                <div className="grid grid-cols-5 gap-1">
                                    {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF', '#CCCCCC', '#888888'].map(c => (
                                        <Button key={c} style={{ backgroundColor: c }} className="h-6 w-6 rounded border" onClick={() => updateElement(selectedElementId!, { color: c })} />
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                   </div>

                  {/* Size Slider */}
                  <div>
                      <Label htmlFor="size-slider" className="text-sm">Size:</Label>
                      <Slider
                          id="size-slider"
                          min={5}
                          max={200} // Adjust max size as needed
                          step={1}
                          value={[selectedElement.size]}
                          onValueChange={(value) => updateElement(selectedElementId!, { size: value[0] })}
                          className="mt-1"
                      />
                  </div>

                    {/* Rotation Buttons */}
                    <div className="flex items-center gap-2">
                        <Label className="text-sm">Rotate:</Label>
                        <Button variant="outline" size="icon" onClick={() => rotateElement('ccw')} title="Rotate Counter-Clockwise">
                            <RotateCcw />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => rotateElement('cw')} title="Rotate Clockwise">
                            <RotateCw />
                        </Button>
                    </div>


                  {/* Layer Controls */}
                  <div className="flex items-center gap-2">
                     <Label className="text-sm">Layer:</Label>
                    <Button variant="outline" size="icon" onClick={() => changeLayer('down')} title="Send Backward">
                       <SendToBack />
                     </Button>
                     <Button variant="outline" size="icon" onClick={() => changeLayer('up')} title="Bring Forward">
                       <BringToFront />
                    </Button>
                  </div>

                  {/* Delete Button */}
                  <Button variant="destructive" size="sm" className="w-full" onClick={deleteSelectedElement}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Element
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center pt-4">Select an element on the canvas to edit it.</p>
              )}
            </TabsContent>
          </Tabs>

          <hr className="my-4 border-border"/>

          {/* Global Actions */}
           <Button onClick={clearComposition} variant="outline" className="w-full">
             <Trash2 className="mr-2 h-4 w-4" /> Clear Canvas
           </Button>

          {/* Premium Packs Placeholder */}
          <div className="border-t border-border pt-4 mt-4">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Premium Packs</h3>
            <p className="text-xs text-muted-foreground">Unlock more elements! (Coming Soon)</p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
