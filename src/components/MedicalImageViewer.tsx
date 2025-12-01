import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2, Download, X, Sliders, Pencil, Circle, ArrowRight, Type, Eraser, Undo, Redo, Eye, EyeOff } from 'lucide-react';
import { imagenMedicaService, type ImagenMedica } from '@/api/imagen-medica.service';

type AnnotationTool = 'none' | 'draw' | 'circle' | 'arrow' | 'text' | 'eraser';

interface Point {
    x: number;
    y: number;
}

interface Annotation {
    id: string;
    tool: AnnotationTool;
    points: Point[];
    color: string;
    thickness: number;
    text?: string;
}

interface MedicalImageViewerProps {
    image: ImagenMedica;
    onClose?: () => void;
    canAnnotate?: boolean;
}

export const MedicalImageViewer = ({ image, onClose, canAnnotate = false }: MedicalImageViewerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const annotationCanvasRef = useRef<HTMLCanvasElement>(null);
    const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);


    const [currentTool, setCurrentTool] = useState<AnnotationTool>('none');
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [annotationColor, setAnnotationColor] = useState('#FF0000');
    const [annotationThickness, setAnnotationThickness] = useState(3);
    const [history, setHistory] = useState<Annotation[][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [showAnnotations, setShowAnnotations] = useState(true);

    // Load image
    useEffect(() => {
        const loadImage = async () => {
            try {
                const url = await imagenMedicaService.getImageUrl(image.id);
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = url;
                img.onload = () => {
                    setImageObj(img);
                };
            } catch (error) {
                console.error('Error loading image:', error);
            }
        };

        loadImage();
    }, [image.id]);

    // Draw image on canvas
    useEffect(() => {
        if (!canvasRef.current || !imageObj) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

        const imgWidth = imageObj.width;
        const imgHeight = imageObj.height;
        ctx.drawImage(imageObj, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

        ctx.restore();
    }, [imageObj, zoom, rotation, brightness, contrast, pan]);

    // Draw annotations on separate canvas
    useEffect(() => {
        if (!annotationCanvasRef.current) return;

        const canvas = annotationCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Only draw if showAnnotations is true
        if (!showAnnotations) return;

        annotations.forEach(annotation => {
            drawAnnotation(ctx, annotation);
        });

        if (currentAnnotation) {
            drawAnnotation(ctx, currentAnnotation);
        }
    }, [annotations, currentAnnotation, showAnnotations, zoom, pan, rotation]);

    const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: Annotation) => {
        if (annotation.points.length === 0) return;

        ctx.save();
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = annotation.thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (annotation.tool) {
            case 'draw':
                ctx.beginPath();
                ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
                annotation.points.forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
                break;

            case 'circle':
                if (annotation.points.length >= 2) {
                    const start = annotation.points[0];
                    const end = annotation.points[annotation.points.length - 1];
                    const radius = Math.sqrt(
                        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
                    );
                    ctx.beginPath();
                    ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                }
                break;

            case 'arrow':
                if (annotation.points.length >= 2) {
                    const start = annotation.points[0];
                    const end = annotation.points[annotation.points.length - 1];

                    // Draw line
                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(end.x, end.y);
                    ctx.stroke();

                    // Draw arrowhead
                    const angle = Math.atan2(end.y - start.y, end.x - start.x);
                    const headLength = 20;
                    ctx.beginPath();
                    ctx.moveTo(end.x, end.y);
                    ctx.lineTo(
                        end.x - headLength * Math.cos(angle - Math.PI / 6),
                        end.y - headLength * Math.sin(angle - Math.PI / 6)
                    );
                    ctx.moveTo(end.x, end.y);
                    ctx.lineTo(
                        end.x - headLength * Math.cos(angle + Math.PI / 6),
                        end.y - headLength * Math.sin(angle + Math.PI / 6)
                    );
                    ctx.stroke();
                }
                break;

            case 'text':
                if (annotation.text && annotation.points.length > 0) {
                    ctx.font = `${annotation.thickness * 8}px Arial`;
                    ctx.fillStyle = annotation.color;
                    ctx.fillText(annotation.text, annotation.points[0].x, annotation.points[0].y);
                }
                break;
        }

        ctx.restore();
    };

    const getCanvasPoint = (e: React.MouseEvent): Point => {
        const canvas = annotationCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleAnnotationMouseDown = (e: React.MouseEvent) => {
        if (currentTool === 'none' || !canAnnotate) {
            handleMouseDown(e);
            return;
        }

        const point = getCanvasPoint(e);
        setIsDrawing(true);

        if (currentTool === 'text') {
            const text = prompt('Ingresa el texto:');
            if (text) {
                const newAnnotation: Annotation = {
                    id: Date.now().toString(),
                    tool: currentTool,
                    points: [point],
                    color: annotationColor,
                    thickness: annotationThickness,
                    text
                };
                addAnnotationToHistory([...annotations, newAnnotation]);
            }
            setIsDrawing(false);
        } else {
            setCurrentAnnotation({
                id: Date.now().toString(),
                tool: currentTool,
                points: [point],
                color: annotationColor,
                thickness: annotationThickness
            });
        }
    };

    const handleAnnotationMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !currentAnnotation || currentTool === 'none') {
            if (isDragging) {
                handleMouseMove(e);
            }
            return;
        }

        const point = getCanvasPoint(e);

        if (currentTool === 'draw') {
            setCurrentAnnotation({
                ...currentAnnotation,
                points: [...currentAnnotation.points, point]
            });
        } else {
            setCurrentAnnotation({
                ...currentAnnotation,
                points: [currentAnnotation.points[0], point]
            });
        }
    };

    const handleAnnotationMouseUp = () => {
        if (currentAnnotation && isDrawing) {
            addAnnotationToHistory([...annotations, currentAnnotation]);
            setCurrentAnnotation(null);
        }
        setIsDrawing(false);
        setIsDragging(false);
    };

    const addAnnotationToHistory = (newAnnotations: Annotation[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newAnnotations);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setAnnotations(newAnnotations);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setAnnotations(history[historyIndex - 1]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setAnnotations(history[historyIndex + 1]);
        }
    };

    const handleClearAnnotations = () => {
        if (window.confirm('¿Estás seguro de borrar todas las anotaciones?')) {
            addAnnotationToHistory([]);
        }
    };

    // Mouse handlers for pan
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.max(0.1, Math.min(5, prev + delta)));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (currentTool !== 'none') return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || currentTool !== 'none') return;
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleReset = () => {
        setZoom(1);
        setRotation(0);
        setBrightness(100);
        setContrast(100);
        setPan({ x: 0, y: 0 });
    };

    const handleDownload = async () => {
        try {
            const url = await imagenMedicaService.getImageUrl(image.id);
            const link = document.createElement('a');
            link.href = url;
            link.download = image.fileName;
            link.click();
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];
    const thicknesses = [1, 2, 3, 5, 8];

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-gray-900 rounded-lg overflow-hidden`}>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-linear-to-b from-black/70 to-transparent p-4 z-10">
                <div className="flex items-center justify-between">
                    <div className="text-white">
                        <h3 className="font-semibold">{image.fileName}</h3>
                        {image.description && (
                            <p className="text-sm text-gray-300">{image.description}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            {isFullscreen ? (
                                <Minimize2 className="w-5 h-5 text-white" />
                            ) : (
                                <Maximize2 className="w-5 h-5 text-white" />
                            )}
                        </button>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Canvas Container */}
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    className={`w-full ${isFullscreen ? 'h-screen' : 'h-[600px]'}`}
                    onWheel={handleWheel}
                />
                <canvas
                    ref={annotationCanvasRef}
                    className={`absolute inset-0 w-full ${isFullscreen ? 'h-screen' : 'h-[600px]'} ${currentTool !== 'none' ? 'cursor-crosshair' : 'cursor-move'}`}
                    onMouseDown={handleAnnotationMouseDown}
                    onMouseMove={handleAnnotationMouseMove}
                    onMouseUp={handleAnnotationMouseUp}
                    onMouseLeave={handleAnnotationMouseUp}
                />
            </div>

            {/* Controls */}
            {showControls && (
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 z-10">
                    <div className="flex flex-col gap-4">
                        {/* Annotation Tools */}
                        {canAnnotate && (
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                <button
                                    onClick={() => setCurrentTool('none')}
                                    className={`p-2 rounded-lg transition-colors ${currentTool === 'none' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
                                    title="Mover"
                                >
                                    <Sliders className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    onClick={() => setCurrentTool('draw')}
                                    className={`p-2 rounded-lg transition-colors ${currentTool === 'draw' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
                                    title="Dibujar"
                                >
                                    <Pencil className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    onClick={() => setCurrentTool('circle')}
                                    className={`p-2 rounded-lg transition-colors ${currentTool === 'circle' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
                                    title="Círculo"
                                >
                                    <Circle className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    onClick={() => setCurrentTool('arrow')}
                                    className={`p-2 rounded-lg transition-colors ${currentTool === 'arrow' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
                                    title="Flecha"
                                >
                                    <ArrowRight className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    onClick={() => setCurrentTool('text')}
                                    className={`p-2 rounded-lg transition-colors ${currentTool === 'text' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
                                    title="Texto"
                                >
                                    <Type className="w-5 h-5 text-white" />
                                </button>

                                <div className="w-px h-8 bg-white/20" />

                                {/* Color Picker */}
                                <div className="flex gap-1">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setAnnotationColor(color)}
                                            className={`w-6 h-6 rounded-full border-2 ${annotationColor === color ? 'border-white' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>

                                <div className="w-px h-8 bg-white/20" />

                                {/* Thickness */}
                                <div className="flex gap-1">
                                    {thicknesses.map(thickness => (
                                        <button
                                            key={thickness}
                                            onClick={() => setAnnotationThickness(thickness)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${annotationThickness === thickness ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
                                            title={`${thickness}px`}
                                        >
                                            <div
                                                className="rounded-full bg-white"
                                                style={{ width: `${thickness * 2}px`, height: `${thickness * 2}px` }}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="w-px h-8 bg-white/20" />

                                {/* Annotation Actions */}
                                <button
                                    onClick={handleUndo}
                                    disabled={historyIndex <= 0}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                                    title="Deshacer"
                                >
                                    <Undo className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    onClick={handleRedo}
                                    disabled={historyIndex >= history.length - 1}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                                    title="Rehacer"
                                >
                                    <Redo className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    onClick={() => setShowAnnotations(!showAnnotations)}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                    title={showAnnotations ? 'Ocultar anotaciones' : 'Mostrar anotaciones'}
                                >
                                    {showAnnotations ? (
                                        <Eye className="w-5 h-5 text-white" />
                                    ) : (
                                        <EyeOff className="w-5 h-5 text-white" />
                                    )}
                                </button>
                                <button
                                    onClick={handleClearAnnotations}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                    title="Borrar todas"
                                >
                                    <Eraser className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        )}

                        {/* Zoom and Rotation */}
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => setZoom(prev => Math.max(0.1, prev - 0.2))}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <ZoomOut className="w-5 h-5 text-white" />
                            </button>
                            <span className="text-white text-sm min-w-[60px] text-center">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                onClick={() => setZoom(prev => Math.min(5, prev + 0.2))}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <ZoomIn className="w-5 h-5 text-white" />
                            </button>
                            <div className="w-px h-8 bg-white/20" />
                            <button
                                onClick={() => setRotation(prev => (prev + 90) % 360)}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <RotateCw className="w-5 h-5 text-white" />
                            </button>
                            <div className="w-px h-8 bg-white/20" />
                            <button
                                onClick={handleDownload}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Download className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Brightness and Contrast */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-white text-xs mb-1 block">Brillo</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={brightness}
                                    onChange={(e) => setBrightness(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-white text-xs mb-1 block">Contraste</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={contrast}
                                    onChange={(e) => setContrast(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle controls button */}
            <button
                onClick={() => setShowControls(!showControls)}
                className="absolute right-4 top-20 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
            >
                <Sliders className="w-5 h-5 text-white" />
            </button>
        </div>
    );
};
