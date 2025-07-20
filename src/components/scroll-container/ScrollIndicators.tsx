/**
 * Component that renders floating navigation indicators for scroll sections.
 *
 * Displays a vertical list of clickable dots on the right side of the screen,
 * with visual states showing the current active section. Provides quick
 * navigation to any section and includes proper accessibility labels.
 *
 * @param totalSections - Number of sections to create indicators for
 * @param currentSection - Index of the currently active section
 * @param onSectionClick - Callback function when an indicator is clicked
 */

interface ScrollIndicatorsProps {
  totalSections: number;
  currentSection: number;
  onSectionClick: (sectionIndex: number) => void;
}

export const ScrollIndicators = ({
  totalSections,
  currentSection,
  onSectionClick,
}: ScrollIndicatorsProps) => {
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col space-y-3">
        {Array.from({ length: totalSections }, (_, index) => (
          <button
            key={index}
            onClick={() => onSectionClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
