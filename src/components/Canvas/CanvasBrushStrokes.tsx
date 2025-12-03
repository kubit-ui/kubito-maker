import { useMemo } from 'react';
import type { BrushStroke, BrushPoint } from '@/types';

interface CanvasBrushStrokesProps {
  strokes: BrushStroke[];
  currentStroke: BrushStroke | null;
  selectedStrokeId?: string | null;
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
 * Obtiene el estilo de trazo (siempre round/pencil)
 */
function getStrokeStyle() {
  return { lineCap: 'round' as const, lineJoin: 'round' as const };
}

/**
 * Renderiza un trazo individual
 */
function BrushStrokePath({
  stroke,
  isSelected,
}: {
  stroke: BrushStroke;
  isSelected: boolean;
}) {
  const pathData = useMemo(
    () => pointsToPath(stroke.points, stroke.settings.smoothing),
    [stroke.points, stroke.settings.smoothing]
  );

  // Calcular el centro del trazo para las transformaciones
  const center = useMemo(() => {
    if (stroke.points.length === 0) return { x: 0, y: 0 };

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

    return {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
    };
  }, [stroke.points]);

  const style = getStrokeStyle();

  if (!stroke.visible) return null;

  // Construir la transformación completa
  // Para rotar y escalar alrededor del centro del trazo:
  // 1. Trasladar al punto de origen (offsetX, offsetY)
  // 2. Trasladar al centro local escalado
  // 3. Aplicar rotación y escala
  // 4. Trasladar de vuelta del centro sin escalar
  const transform = `translate(${stroke.offsetX}, ${stroke.offsetY}) translate(${center.x * stroke.scale}, ${center.y * stroke.scale}) rotate(${stroke.rotate}) scale(${stroke.scale}) translate(${-center.x}, ${-center.y})`;

  return (
    <g transform={transform}>
      {/* Halo de selección */}
      {isSelected && (
        <path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={stroke.settings.size + 4}
          strokeOpacity={0.3}
          strokeLinecap={style.lineCap}
          strokeLinejoin={style.lineJoin}
          pointerEvents="none"
        />
      )}

      {/* Trazo principal */}
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
        className={`cursor-pointer hover:stroke-opacity-75 transition-opacity ${isSelected ? 'stroke-opacity-100' : ''}`}
      />
    </g>
  );
}

/**
 * Componente que renderiza todos los trazos de pincel
 */
export function CanvasBrushStrokes({
  strokes,
  currentStroke,
  selectedStrokeId,
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
        <BrushStrokePath
          key={stroke.id}
          stroke={stroke}
          isSelected={selectedStrokeId === stroke.id}
        />
      ))}

      {/* Trazo actual (en progreso) */}
      {currentStroke && currentStroke.points.length > 0 && (
        <BrushStrokePath stroke={currentStroke} isSelected={false} />
      )}
    </g>
  );
}
