import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onChange, size = 16, showValue = false }) => {
  const [hovered, setHovered] = useState(0);
  const interactive = !!onChange;
  const display = interactive ? (hovered || rating) : rating;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={interactive ? () => onChange(star) : undefined}
            onMouseEnter={interactive ? () => setHovered(star) : undefined}
            onMouseLeave={interactive ? () => setHovered(0) : undefined}
            className={`transition-all duration-200 ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
          >
            <Star
              size={size}
              className={`transition-colors duration-200 ${filled ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-muted-foreground/30'}`}
            />
          </button>
        );
      })}
      {showValue && rating > 0 && (
        <span className="text-sm font-semibold text-yellow-500 ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
