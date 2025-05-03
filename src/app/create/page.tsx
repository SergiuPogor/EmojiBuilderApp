
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Square, Circle as CircleIcon, Eye, Smile, Trash2, Save, BringToFront, SendToBack, RotateCcw, RotateCw, Download, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


// Define element types and their properties
interface EmojiElement {
  id: string;
  type: 'base' | 'eye' | 'mouth' | 'accessory';
  shape: 'circle' | 'square' | 'simple-eye' | 'wink-eye' | 'angry-eye' | 'line-eye' | 'simple-smile' | 'open-smile' | 'sad-mouth' | 'straight-mouth' | 'tear' | 'glasses' | 'hat'; // Add more shapes
  color: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  zIndex: number;
}

// Predefined elements library (Expanded)
const elementLibrary = {
  base: [
    { type: 'base', shape: 'circle', color: '#FFD700', size: 100, name: 'Yellow Circle' },
    { type: 'base', shape: 'square', color: '#ADD8E6', size: 100, name: 'Blue Square' },
    { type: 'base', shape: 'circle', color: '#90EE90', size: 100, name: 'Green Circle' }, // Light green
    { type: 'base', shape: 'circle', color: '#FFB6C1', size: 100, name: 'Pink Circle' }, // Light pink
  ],
  eye: [
    { type: 'eye', shape: 'simple-eye', color: '#000000', size: 15, name: 'Simple Eye' },
    { type: 'eye', shape: 'wink-eye', color: '#000000', size: 15, name: 'Wink Eye' },
    { type: 'eye', shape: 'angry-eye', color: '#000000', size: 15, name: 'Angry Eye' },
    { type: 'eye', shape: 'line-eye', color: '#000000', size: 15, name: 'Line Eye' },
  ],
  mouth: [
     { type: 'mouth', shape: 'simple-smile', color: '#000000', size: 30, name: 'Simple Smile' },
     { type: 'mouth', shape: 'open-smile', color: '#000000', size: 30, name: 'Open Smile' },
     { type: 'mouth', shape: 'sad-mouth', color: '#000000', size: 30, name: 'Sad Mouth' },
     { type: 'mouth', shape: 'straight-mouth', color: '#000000', size: 30, name: 'Straight Mouth' },
  ],
  accessory: [
    { type: 'accessory', shape: 'tear', color: '#00BFFF', size: 20, name: 'Tear Drop' }, // Deep sky blue
    { type: 'accessory', shape: 'glasses', color: '#000000', size: 50, name: 'Glasses' },
    { type: 'accessory', shape: 'hat', color: '#A0522D', size: 60, name: 'Top Hat' }, // Sienna brown
  ]
};

// Generate unique IDs
let elementCounter = 0;
const generateId = () => `element-${Date.now()}-${elementCounter++}`;

export default function CreatePage() {
  const { toast } = useToast();
  const [composition, setComposition] = useState<EmojiElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null); // Ref for the hidden SVG for export
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });
  const [draggingElement, setDraggingElement] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'svg' | 'png'>('png');
  const [downloadSize, setDownloadSize] = useState<number>(128);

  // Update canvas size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const { clientWidth } = canvasRef.current;
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
      x: canvasSize.width / 2 - elementTemplate.size / 2,
      y: canvasSize.height / 2 - elementTemplate.size / 2,
      rotation: 0,
      zIndex: composition.length + 1,
    };
    setComposition([...composition, newElement]);
    setSelectedElementId(newElement.id);
  };

  // Select element
  const handleSelectElement = (id: string, event: React.MouseEvent) => {
     event.stopPropagation();
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
    setSelectedElementId(id);

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
    event.preventDefault();

    const canvasRect = canvasRef.current.getBoundingClientRect();
    let newX = event.clientX - canvasRect.left - draggingElement.offsetX;
    let newY = event.clientY - canvasRect.top - draggingElement.offsetY;

    updateElement(draggingElement.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDraggingElement(null);
  };

  const handleMouseLeave = () => {
     if (draggingElement) {
      setDraggingElement(null);
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
    const sortedComposition = [...composition].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sortedComposition.findIndex(el => el.id === selectedElementId);
    if (currentIndex === -1) return;

    const newComposition = [...sortedComposition];
    const element = newComposition[currentIndex];

    if (direction === 'up' && currentIndex < newComposition.length - 1) {
      const elementAbove = newComposition[currentIndex + 1];
      [element.zIndex, elementAbove.zIndex] = [elementAbove.zIndex, element.zIndex];
    } else if (direction === 'down' && currentIndex > 0) {
      const elementBelow = newComposition[currentIndex - 1];
       [element.zIndex, elementBelow.zIndex] = [elementBelow.zIndex, element.zIndex];
    }

    // Update the main state after sorting by zIndex
    setComposition(newComposition.sort((a, b) => a.zIndex - b.zIndex));
  };

    // Rotate element
    const rotateElement = (direction: 'cw' | 'ccw') => {
        if (!selectedElementId) return;
        const currentElement = composition.find(el => el.id === selectedElementId);
        if (!currentElement) return;
        const rotationAmount = direction === 'cw' ? 15 : -15;
        updateElement(selectedElementId, { rotation: (currentElement.rotation + rotationAmount + 360) % 360 }); // Ensure positive rotation
    };


  // Save composition (placeholder)
  const saveComposition = () => {
     console.log('Saving composition:', JSON.stringify(composition));
     toast({ title: "Composition Saved (Simulated)", description: "Check console for data." });
   };

   // --- Download Logic ---
    const getSVGString = (size: number): string => {
        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgElement.setAttribute('viewBox', `0 0 ${canvasSize.width} ${canvasSize.height}`);
        svgElement.setAttribute('width', String(size));
        svgElement.setAttribute('height', String(size));

        // Create a background rect if needed (optional, defaults to transparent)
        // svgElement.innerHTML = `<rect width="100%" height="100%" fill="#FFFFFF"/>`; // Example white background

        composition.sort((a, b) => a.zIndex - b.zIndex).forEach(element => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('transform', `translate(${element.x + element.size / 2}, ${element.y + element.size / 2}) rotate(${element.rotation}) translate(${-element.size / 2}, ${-element.size / 2})`);

            const svgContent = renderSingleElementSVG(element); // Get SVG content for the element
            if (svgContent) {
                g.innerHTML = svgContent;
                 svgElement.appendChild(g);
            }
        });

        return new XMLSerializer().serializeToString(svgElement);
    };

   const downloadSVG = (size: number) => {
        const svgString = getSVGString(size);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `emoji_${size}x${size}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "SVG Downloaded", description: `Size: ${size}x${size}` });
        setIsDownloadDialogOpen(false);
    };

    const downloadPNG = (size: number) => {
        const svgString = getSVGString(size);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            toast({ title: "Error", description: "Canvas context not available", variant: "destructive" });
            return;
        }

        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, size, size);
            URL.revokeObjectURL(svgUrl); // Revoke SVG URL after drawing

            const pngUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `emoji_${size}x${size}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast({ title: "PNG Downloaded", description: `Size: ${size}x${size}` });
             setIsDownloadDialogOpen(false);
        };
        img.onerror = (e) => {
             console.error("Error loading SVG image:", e);
             toast({ title: "Error", description: "Could not load SVG for PNG conversion.", variant: "destructive" });
             URL.revokeObjectURL(svgUrl); // Revoke SVG URL on error
        };
        img.src = svgUrl;
    };

    const handleDownload = () => {
        if (downloadFormat === 'svg') {
            downloadSVG(downloadSize);
        } else {
            downloadPNG(downloadSize);
        }
    };


  // Get selected element data for controls
  const selectedElement = composition.find(el => el.id === selectedElementId);

   // --- Rendering Individual SVG Elements for Download ---
    const renderSingleElementSVG = (element: EmojiElement): string | null => {
        const props = { width: element.size, height: element.size, fill: element.color };
        switch (element.shape) {
            case 'circle':
                return `<circle cx="${element.size / 2}" cy="${element.size / 2}" r="${element.size / 2}" fill="${element.color}" />`;
            case 'square':
                return `<rect x="0" y="0" width="${element.size}" height="${element.size}" fill="${element.color}" />`;
            case 'simple-eye':
                 // viewBox adjusted to element size for simplicity here
                 return `<svg viewBox="0 0 20 20" width="${element.size}" height="${element.size}">
                           <circle cx="10" cy="10" r="8" fill="${element.color}" />
                           <circle cx="12" cy="8" r="2" fill="#FFFFFF" />
                        </svg>`;
             case 'wink-eye':
                return `<svg viewBox="0 0 20 15" width="${element.size}" height="${element.size * 0.75}">
                            <path d="M 2 7 Q 10 1 18 7" stroke="${element.color}" stroke-width="2" fill="none" stroke-linecap="round"/>
                        </svg>`;
             case 'angry-eye':
                 return `<svg viewBox="0 0 20 15" width="${element.size}" height="${element.size * 0.75}">
                            <line x1="3" y1="3" x2="10" y2="10" stroke="${element.color}" stroke-width="2" stroke-linecap="round"/>
                            <line x1="17" y1="3" x2="10" y2="10" stroke="${element.color}" stroke-width="2" stroke-linecap="round"/>
                         </svg>`;
             case 'line-eye':
                 return `<svg viewBox="0 0 20 5" width="${element.size}" height="${element.size * 0.25}">
                            <line x1="1" y1="2.5" x2="19" y2="2.5" stroke="${element.color}" stroke-width="2" stroke-linecap="round"/>
                         </svg>`;
            case 'simple-smile':
                // viewBox adjusted to element size for simplicity here
                return `<svg viewBox="0 0 50 20" width="${element.size}" height="${element.size * 0.4}">
                           <path d="M 5,10 Q 25,20 45,10" stroke="${element.color}" stroke-width="3" fill="none" stroke-linecap="round" />
                        </svg>`;
            case 'open-smile':
                return `<svg viewBox="0 0 50 30" width="${element.size}" height="${element.size * 0.6}">
                           <path d="M 5,10 Q 25,30 45,10" stroke="${element.color}" stroke-width="3" fill="none" stroke-linecap="round"/>
                           <path d="M 10 15 Q 25 25 40 15" stroke="${element.color}" stroke-width="2" fill="none" stroke-linecap="round"/>
                        </svg>`;
            case 'sad-mouth':
                 return `<svg viewBox="0 0 50 20" width="${element.size}" height="${element.size * 0.4}">
                            <path d="M 5,15 Q 25,5 45,15" stroke="${element.color}" stroke-width="3" fill="none" stroke-linecap="round" />
                         </svg>`;
             case 'straight-mouth':
                 return `<svg viewBox="0 0 50 10" width="${element.size}" height="${element.size * 0.2}">
                            <line x1="5" y1="5" x2="45" y2="5" stroke="${element.color}" stroke-width="3" stroke-linecap="round"/>
                         </svg>`;
             case 'tear':
                 return `<svg viewBox="0 0 20 30" width="${element.size}" height="${element.size * 1.5}">
                             <path d="M 10 0 C 0 15 0 25 10 30 C 20 25 20 15 10 0 Z" fill="${element.color}" />
                         </svg>`;
             case 'glasses':
                  return `<svg viewBox="0 0 100 40" width="${element.size}" height="${element.size * 0.4}">
                              <circle cx="25" cy="20" r="15" stroke="${element.color}" stroke-width="3" fill="none"/>
                              <circle cx="75" cy="20" r="15" stroke="${element.color}" stroke-width="3" fill="none"/>
                              <line x1="40" y1="20" x2="60" y2="20" stroke="${element.color}" stroke-width="3"/>
                          </svg>`;
             case 'hat':
                 return `<svg viewBox="0 0 100 80" width="${element.size}" height="${element.size * 0.8}">
                             <rect x="10" y="20" width="80" height="50" fill="${element.color}" />
                             <rect x="0" y="60" width="100" height="10" fill="${element.color}" />
                         </svg>`;
            default:
                console.warn("Unsupported shape for SVG export:", element.shape);
                return null;
        }
    };

  // --- Rendering Visible Elements on Canvas ---
  const renderElement = (element: EmojiElement) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.size}px`,
      height: `auto`, // Use auto height for aspect ratio based on SVG
      transform: `rotate(${element.rotation}deg)`,
      cursor: draggingElement?.id === element.id ? 'grabbing' : 'grab',
      zIndex: element.zIndex,
      outline: selectedElementId === element.id ? '2px dashed hsl(var(--accent))' : 'none',
      outlineOffset: '2px',
      userSelect: 'none',
      display: 'flex', // Use flex to contain the SVG properly
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Use the same SVG generation logic as for export, but render inline
    const svgContent = renderSingleElementSVG(element);

    return (
         <div
            key={element.id}
            style={style}
            onMouseDown={(e) => handleMouseDown(element.id, e)}
            onClick={(e) => handleSelectElement(element.id, e)}
            // Set innerHTML - Use carefully, ensure SVG content is safe
            dangerouslySetInnerHTML={{ __html: svgContent || '' }}
        />
    );
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
            onMouseLeave={handleMouseLeave}
            onClick={handleCanvasClick}
          >
            {composition.sort((a, b) => a.zIndex - b.zIndex).map(renderElement)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
           <Button onClick={saveComposition} variant="outline" size="sm">
             <Save className="mr-2 h-4 w-4" /> Save
           </Button>
            <Dialog open={isDownloadDialogOpen} onOpenChange={setIsDownloadDialogOpen}>
               <DialogTrigger asChild>
                 <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                   <Download className="mr-2 h-4 w-4" /> Download
                 </Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>Download Emoji</DialogTitle>
                   <DialogDescription>
                     Choose the format and size for your emoji download.
                   </DialogDescription>
                 </DialogHeader>
                 <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="format" className="text-right">Format</Label>
                        <Select value={downloadFormat} onValueChange={(value: 'svg' | 'png') => setDownloadFormat(value)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="png">PNG</SelectItem>
                                <SelectItem value="svg">SVG</SelectItem>
                            </SelectContent>
                         </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="size" className="text-right">Size (px)</Label>
                         <RadioGroup
                             defaultValue="128"
                             className="col-span-3 flex gap-4"
                             onValueChange={(value) => setDownloadSize(parseInt(value))}
                             value={String(downloadSize)}
                         >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="64" id="s64" />
                                <Label htmlFor="s64">64</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="128" id="s128" />
                                <Label htmlFor="s128">128</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="256" id="s256" />
                                <Label htmlFor="s256">256</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="512" id="s512" />
                                <Label htmlFor="s512">512</Label>
                              </div>
                         </RadioGroup>
                    </div>
                 </div>
                 <DialogFooter>
                   <DialogClose asChild>
                       <Button variant="outline">Cancel</Button>
                   </DialogClose>
                   <Button onClick={handleDownload}>Download</Button>
                 </DialogFooter>
               </DialogContent>
             </Dialog>
        </CardFooter>
      </Card>

      {/* Toolbar & Controls */}
      <Card className="w-full lg:w-96 flex-shrink-0 bg-card shadow-lg"> {/* Increased width */}
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
               <ScrollArea className="h-96 mt-2"> {/* Increased height */}
                <div className="space-y-3 p-1">
                   {Object.entries(elementLibrary).map(([type, elements]) => (
                      elements.length > 0 && (
                         <div key={type}>
                           <h3 className="text-sm font-medium mb-2 text-muted-foreground capitalize">{type}</h3>
                           <div className="grid grid-cols-3 gap-2">
                             {elements.map((el, i) => (
                                <Button
                                  key={`${type}-${i}`}
                                  variant="outline"
                                  size="sm"
                                  className="flex-col h-auto p-2 justify-center items-center"
                                  onClick={() => addElement(type as keyof typeof elementLibrary, el)}
                                  title={el.name}
                                >
                                  {/* Simple preview icons */}
                                  {type === 'base' && el.shape === 'circle' && <CircleIcon className="h-5 w-5 mb-1" style={{ color: el.color }} />}
                                  {type === 'base' && el.shape === 'square' && <Square className="h-5 w-5 mb-1" style={{ color: el.color }} />}
                                  {type === 'eye' && <Eye className="h-5 w-5 mb-1" />}
                                  {type === 'mouth' && <Smile className="h-5 w-5 mb-1" />}
                                   {type === 'accessory' && <Settings className="h-5 w-5 mb-1" />} {/* Generic icon for accessories */}
                                  <span className="text-[10px] text-center leading-tight line-clamp-2">{el.name}</span>
                                </Button>
                             ))}
                           </div>
                         </div>
                      )
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Controls Tab */}
            <TabsContent value="controls">
              {selectedElement ? (
                <ScrollArea className="h-96 mt-2"> {/* Added ScrollArea */}
                <div className="space-y-4 p-1">
                   <p className="text-sm font-medium text-center">Editing: {selectedElement.type} ({selectedElement.shape})</p>
                   {/* Color Picker */}
                   <div className="flex items-center gap-2">
                     <Label htmlFor="color-picker" className="text-sm flex-shrink-0">Color:</Label>
                      <Input
                         id="color-picker"
                         type="color"
                         value={selectedElement.color}
                         onChange={(e) => updateElement(selectedElementId!, { color: e.target.value })}
                         className="w-12 h-8 p-0 border-none cursor-pointer"
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
                                    {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF', '#CCCCCC', '#888888', '#FFD700', '#ADD8E6', '#90EE90', '#FFB6C1', '#A0522D', '#00BFFF'].map(c => (
                                        <Button key={c} style={{ backgroundColor: c }} className="h-6 w-6 rounded border" onClick={() => updateElement(selectedElementId!, { color: c })} />
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                   </div>

                  {/* Size Slider */}
                  <div>
                      <Label htmlFor="size-slider" className="text-sm block mb-1">Size:</Label>
                      <Slider
                          id="size-slider"
                          min={5}
                          max={300} // Increased max size
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
                            <RotateCcw className="h-4 w-4"/>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => rotateElement('cw')} title="Rotate Clockwise">
                            <RotateCw className="h-4 w-4"/>
                        </Button>
                    </div>


                  {/* Layer Controls */}
                  <div className="flex items-center gap-2">
                     <Label className="text-sm">Layer:</Label>
                    <Button variant="outline" size="icon" onClick={() => changeLayer('down')} title="Send Backward">
                       <SendToBack className="h-4 w-4"/>
                     </Button>
                     <Button variant="outline" size="icon" onClick={() => changeLayer('up')} title="Bring Forward">
                       <BringToFront className="h-4 w-4"/>
                    </Button>
                  </div>

                  {/* Delete Button */}
                  <Button variant="destructive" size="sm" className="w-full" onClick={deleteSelectedElement}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Element
                  </Button>
                </div>
                </ScrollArea>
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
