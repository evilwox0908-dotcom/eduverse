import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  FileText,
  Eraser,
  RotateCcw,
  X,
  Minimize2,
  Maximize2,
  Trash2,
} from 'lucide-react';

interface ExamScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamScratchpad: React.FC<ExamScratchpadProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'notes'>('draw');
  const [notesText, setNotesText] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#2563eb');
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [isEraser, setIsEraser] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastXRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);

  useEffect(() => {
    if (!isOpen || isMinimized || activeTab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions to parent bounding rect
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      // Save content if any
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.drawImage(tempCanvas, 0, 0);
      }
    }
  }, [isOpen, isMinimized, activeTab]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    isDrawingRef.current = true;
    lastXRef.current = clientX - rect.left;
    lastYRef.current = clientY - rect.top;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastXRef.current, lastYRef.current);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? lineWidth * 6 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastXRef.current = currentX;
    lastYRef.current = currentY;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div
      id="exam-scratchpad-modal"
      className={`fixed bottom-6 left-6 z-50 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-900 transition-all duration-200 ${
        isMinimized ? 'w-72 h-14' : 'w-[90vw] max-w-md sm:max-w-lg h-[460px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white select-none">
        <div className="flex items-center space-x-2">
          <PenTool className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold tracking-wide">Candidate Scratchpad</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            id="toggle-minimize-scratchpad"
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            id="close-scratchpad-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Scratchpad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col h-[calc(460px-52px)] bg-slate-50">
          {/* Tabs and Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
            <div className="flex space-x-1 p-1 bg-slate-100 rounded-lg">
              <button
                id="scratchpad-draw-tab"
                onClick={() => setActiveTab('draw')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'draw'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Draw / Canvas</span>
              </button>
              <button
                id="scratchpad-notes-tab"
                onClick={() => setActiveTab('notes')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'notes'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Text Notes</span>
              </button>
            </div>

            {activeTab === 'draw' && (
              <div className="flex items-center space-x-2">
                <button
                  id="scratchpad-pen-btn"
                  onClick={() => setIsEraser(false)}
                  className={`p-1.5 rounded-md transition-colors ${
                    !isEraser ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  title="Pen"
                >
                  <PenTool className="w-3.5 h-3.5" />
                </button>
                <button
                  id="scratchpad-eraser-btn"
                  onClick={() => setIsEraser(true)}
                  className={`p-1.5 rounded-md transition-colors ${
                    isEraser ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  title="Eraser"
                >
                  <Eraser className="w-3.5 h-3.5" />
                </button>
                <button
                  id="scratchpad-clear-btn"
                  onClick={clearCanvas}
                  className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Clear Canvas"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 relative overflow-hidden bg-white">
            {activeTab === 'draw' ? (
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full cursor-crosshair touch-none bg-white"
              />
            ) : (
              <textarea
                id="scratchpad-notes-textarea"
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Type your scratch notes, equations, or reasoning here (auto-saved during exam)..."
                className="w-full h-full p-4 resize-none outline-none text-sm text-slate-800 placeholder:text-slate-400 font-sans leading-relaxed"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
