'use client';

/**
 * CohortGrid Component
 * 
 * Displays all 6 cohorts in a responsive 2-column, 3-row grid.
 * Used on the main lobby page.
 */

import CohortTile from './CohortTile';
import type { Cohort } from '@/types';

interface CohortGridProps {
  /** Array of cohorts to display */
  cohorts: Omit<Cohort, 'dailyRoomUrl'>[];
}

export default function CohortGrid({ cohorts }: CohortGridProps) {
  if (cohorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-overcast-white mb-2">
          No Cohorts Available
        </h3>
        <p className="text-overcast-gray">
          Check back later for upcoming sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
      {cohorts.map((cohort, index) => (
        <div
          key={cohort.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CohortTile
            id={cohort.id}
            name={cohort.name}
            image={cohort.image}
            description={cohort.description}
            capacity={cohort.capacity}
          />
        </div>
      ))}
    </div>
  );
}

