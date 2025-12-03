import { useRef, useEffect } from 'react';
import type { BrushStroke } from '@/types';

interface CanvasStrokeTransformControlsProps {
  stroke: BrushStroke;
  toSvgPoint: (evt: PointerEvent | MouseEvent) => { x: number; y: number };
  onUpdateTransform: (transform: { scale?: number; rotate?: number }) => void;
  onMove: (offsetX: number, offsetY: number) => void;
}

export function CanvasStrokeTransformControls({
  stroke,
  toSvgPoint,
  onUpdateTransform,
  onMove,
}: CanvasStrokeTransformControlsProps) {
  const isDragging = useRef(false);
  const isRotating = useRef(false);
  const isScaling = useRef(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const startTransform = useRef<{
    offsetX: number;
    offsetY: number;
    scale: number;
    rotate: number;
  } | null>(null);

  // Calcular el bounding box del trazo en su espacio local
  const getBoundingBox = () => {
    if (stroke.points.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0, centerX: 0, centerY: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    stroke.points.forEach((point) => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });

    // El centro está en el espacio local del trazo (sin transformaciones)
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    return { minX, minY, maxX, maxY, centerX, centerY };
  };

  const bbox = getBoundingBox();
  const width = bbox.maxX - bbox.minX;
  const height = bbox.maxY - bbox.minY;

  // Centro del trazo en coordenadas del canvas (espacio global)
  // Este es el centro alrededor del cual rotamos
  const globalCenterX = stroke.offsetX + bbox.centerX * stroke.scale;
  const globalCenterY = stroke.offsetY + bbox.centerY * stroke.scale;

  // Handlers para los controles
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!startPoint.current || !startTransform.current) return;

      const currentPoint = toSvgPoint(e);

      if (isDragging.current) {
        // Mover el trazo
        const deltaX = currentPoint.x - startPoint.current.x;
        const deltaY = currentPoint.y - startPoint.current.y;
        onMove(
          startTransform.current.offsetX + deltaX,
          startTransform.current.offsetY + deltaY
        );
      } else if (isRotating.current) {
        // Rotar el trazo alrededor de su centro global
        // Necesitamos calcular el centro considerando la posición actual y escala
        const startAngle = Math.atan2(
          startPoint.current.y - globalCenterY,
          startPoint.current.x - globalCenterX
        );
        const currentAngle = Math.atan2(
          currentPoint.y - globalCenterY,
          currentPoint.x - globalCenterX
        );

        const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);
        const newRotate = startTransform.current.rotate + deltaAngle;

        onUpdateTransform({ rotate: newRotate });
      } else if (isScaling.current) {
        // Escalar el trazo desde su centro, manteniendo el centro fijo
        const startDist = Math.hypot(
          startPoint.current.x - globalCenterX,
          startPoint.current.y - globalCenterY
        );
        const currentDist = Math.hypot(
          currentPoint.x - globalCenterX,
          currentPoint.y - globalCenterY
        );

        const scaleFactor = currentDist / startDist;
        const newScale = Math.max(
          0.1,
          startTransform.current.scale * scaleFactor
        );

        // Calcular el nuevo offset para mantener el centro en la misma posición
        // Cuando la escala cambia, el centro (offsetX + centerX * scale) debe permanecer igual
        const centerX = (bbox.minX + bbox.maxX) / 2;
        const centerY = (bbox.minY + bbox.maxY) / 2;

        // Nuevo offset = globalCenter - centerLocal * newScale
        const newOffsetX = globalCenterX - centerX * newScale;
        const newOffsetY = globalCenterY - centerY * newScale;

        onUpdateTransform({ scale: newScale });
        onMove(newOffsetX, newOffsetY);
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      isRotating.current = false;
      isScaling.current = false;
      startPoint.current = null;
      startTransform.current = null;
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [
    stroke,
    bbox,
    globalCenterX,
    globalCenterY,
    toSvgPoint,
    onMove,
    onUpdateTransform,
  ]);

  const handleBboxPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const point = toSvgPoint(e.nativeEvent);
    isDragging.current = true;
    startPoint.current = point;
    startTransform.current = {
      offsetX: stroke.offsetX,
      offsetY: stroke.offsetY,
      scale: stroke.scale,
      rotate: stroke.rotate,
    };
  };

  const handleRotatePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const point = toSvgPoint(e.nativeEvent);
    isRotating.current = true;
    startPoint.current = point;
    startTransform.current = {
      offsetX: stroke.offsetX,
      offsetY: stroke.offsetY,
      scale: stroke.scale,
      rotate: stroke.rotate,
    };
  };

  const handleScalePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const point = toSvgPoint(e.nativeEvent);
    isScaling.current = true;
    startPoint.current = point;
    startTransform.current = {
      offsetX: stroke.offsetX,
      offsetY: stroke.offsetY,
      scale: stroke.scale,
      rotate: stroke.rotate,
    };
  };

  // Transformación del bounding box y del trazo
  // Para rotar y escalar alrededor del centro:
  // 1. Trasladar al punto de origen (offsetX, offsetY)
  // 2. Trasladar al centro local del trazo
  // 3. Aplicar rotación y escala
  // 4. Trasladar de vuelta del centro
  const transform = `translate(${stroke.offsetX}, ${stroke.offsetY}) translate(${bbox.centerX * stroke.scale}, ${bbox.centerY * stroke.scale}) rotate(${stroke.rotate}) scale(${stroke.scale}) translate(${-bbox.centerX}, ${-bbox.centerY})`;

  return (
    <g className="stroke-transform-controls">
      {/* Bounding box */}
      <rect
        x={bbox.minX}
        y={bbox.minY}
        width={width}
        height={height}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2 / stroke.scale}
        strokeDasharray="5,5"
        transform={transform}
        onPointerDown={handleBboxPointerDown}
        style={{ cursor: 'move' }}
      />

      {/* Handle de rotación (arriba al centro) */}
      <g transform={transform}>
        <line
          x1={bbox.centerX}
          y1={bbox.minY}
          x2={bbox.centerX}
          y2={bbox.minY - 30 / stroke.scale}
          stroke="#3b82f6"
          strokeWidth={1 / stroke.scale}
        />
        <circle
          cx={bbox.centerX}
          cy={bbox.minY - 30 / stroke.scale}
          r={6 / stroke.scale}
          fill="#3b82f6"
          stroke="white"
          strokeWidth={2 / stroke.scale}
          onPointerDown={handleRotatePointerDown}
          style={{ cursor: 'grab' }}
        />
      </g>

      {/* Handle de escala (esquina inferior derecha) */}
      <g transform={transform}>
        <circle
          cx={bbox.maxX}
          cy={bbox.maxY}
          r={6 / stroke.scale}
          fill="#3b82f6"
          stroke="white"
          strokeWidth={2 / stroke.scale}
          onPointerDown={handleScalePointerDown}
          style={{ cursor: 'nwse-resize' }}
        />
      </g>

      {/* Handles de escala en las otras esquinas */}
      <g transform={transform}>
        <circle
          cx={bbox.minX}
          cy={bbox.minY}
          r={6 / stroke.scale}
          fill="#3b82f6"
          stroke="white"
          strokeWidth={2 / stroke.scale}
          onPointerDown={handleScalePointerDown}
          style={{ cursor: 'nwse-resize' }}
        />
        <circle
          cx={bbox.maxX}
          cy={bbox.minY}
          r={6 / stroke.scale}
          fill="#3b82f6"
          stroke="white"
          strokeWidth={2 / stroke.scale}
          onPointerDown={handleScalePointerDown}
          style={{ cursor: 'nesw-resize' }}
        />
        <circle
          cx={bbox.minX}
          cy={bbox.maxY}
          r={6 / stroke.scale}
          fill="#3b82f6"
          stroke="white"
          strokeWidth={2 / stroke.scale}
          onPointerDown={handleScalePointerDown}
          style={{ cursor: 'nesw-resize' }}
        />
      </g>
    </g>
  );
}
