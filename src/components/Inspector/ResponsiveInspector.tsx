import { memo } from 'react';
import { Inspector } from './Inspector';
import { BottomSheet } from '../BottomSheet';
import { useIsMobile } from '@/hooks';
import { useSelection } from '@/store/editorStore';

interface ResponsiveInspectorProps {
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Responsive Inspector wrapper
 * - Desktop: Traditional right sidebar
 * - Mobile: Bottom sheet
 */
export const ResponsiveInspector = memo<ResponsiveInspectorProps>(
  ({ isOpen = true, onClose }) => {
    const isMobile = useIsMobile();
    const { selectedId, selectedIds } = useSelection();

    // Auto-open in mobile when something is selected
    const shouldShowMobile =
      isMobile && (!!selectedId || selectedIds.length > 0);

    // Mobile: Bottom Sheet
    if (isMobile) {
      return (
        <BottomSheet
          isOpen={shouldShowMobile && isOpen}
          onClose={() => onClose?.()}
          title="Properties"
          snapPoints={[0.5, 0.75, 0.92]}
          defaultSnapPoint={1}
        >
          <Inspector />
        </BottomSheet>
      );
    }

    // Desktop: Regular sidebar
    return (
      <div className="relative z-40 h-full">
        <Inspector />
      </div>
    );
  }
);

ResponsiveInspector.displayName = 'ResponsiveInspector';
