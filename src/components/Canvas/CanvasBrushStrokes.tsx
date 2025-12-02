import { useMemo } from 'react';
import type { BrushStroke, BrushPoint } from '@/types';

interface CanvasBrushStrokesProps {
  strokes: BrushStroke[];
  currentStroke: BrushStroke | null;
}

/**
 * Convierte un array de puntos en un path SVG usando interpolación
 */
function pointsToPath(points: BrushPoint[], smoothing: number): string {
  if (points.length === 0) return '';

  const firstPoint = points[0];
  if (!firstPoint) return '';

  if (points.length === 1) {
    // Para un solo punto, dibuja un pequeño círculo
    return `M ${firstPoint.x} ${firstPoint.y} L ${firstPoint.x + 0.1} ${firstPoint.y}`;
  }

  if (smoothing === 0) {
    // Sin suavizado: línea recta entre puntos
    const rest = points.slice(1);
    return `M ${firstPoint.x} ${firstPoint.y} L ${rest.map((p) => `${p.x} ${p.y}`).join(' L ')}`;
  }

  // Con suavizado: curva Catmull-Rom
  const path: string[] = [];
  path.push(`M ${firstPoint.x} ${firstPoint.y}`);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i > 0 ? i - 1 : i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    if (!p0 || !p1 || !p2 || !p3) continue;

    // Control points para la curva de Bézier
    const tension = smoothing * 0.5;
    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;

    path.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }

  return path.join(' ');
}

/**
 * Obtiene el estilo de trazo según el tipo de pincel
 */
function getStrokeStyle(type: string) {
  switch (type) {
    case 'square':
      return { lineCap: 'square' as const, lineJoin: 'miter' as const };
    case 'marker':
      return { lineCap: 'square' as const, lineJoin: 'round' as const };
    case 'pencil':
      return { lineCap: 'round' as const, lineJoin: 'round' as const };
    case 'calligraphy':
      return { lineCap: 'butt' as const, lineJoin: 'bevel' as const };
    case 'round':
    default:
      return { lineCap: 'round' as const, lineJoin: 'round' as const };
  }
}

/**
 * Renderiza un trazo individual
 */
function BrushStrokePath({ stroke }: { stroke: BrushStroke }) {
  const pathData = useMemo(
    () => pointsToPath(stroke.points, stroke.settings.smoothing),
    [stroke.points, stroke.settings.smoothing]
  );

  const style = getStrokeStyle(stroke.settings.type);

  if (!stroke.visible) return null;

  return (
    <path
      d={pathData}
      fill="none"
      stroke={stroke.settings.color}
      strokeWidth={stroke.settings.size}
      strokeOpacity={stroke.settings.opacity}
      strokeLinecap={style.lineCap}
      strokeLinejoin={style.lineJoin}
      pointerEvents="stroke"
      data-stroke-id={stroke.id}
      className="cursor-pointer hover:stroke-opacity-75 transition-opacity"
    />
  );
}

/**
 * Componente que renderiza todos los trazos de pincel
 */
export function CanvasBrushStrokes({
  strokes,
  currentStroke,
}: CanvasBrushStrokesProps) {
  // Ordenar trazos por z-index
  const sortedStrokes = useMemo(
    () => [...strokes].sort((a, b) => a.z - b.z),
    [strokes]
  );

  return (
    <g className="brush-strokes-layer">
      {/* Trazos completados */}
      {sortedStrokes.map((stroke) => (
        <BrushStrokePath key={stroke.id} stroke={stroke} />
      ))}

      {/* Trazo actual (en progreso) */}
      {currentStroke && currentStroke.points.length > 0 && (
        <BrushStrokePath stroke={currentStroke} />
      )}
    </g>
  );
}
