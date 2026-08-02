import { useState, useEffect, useCallback } from 'react';
import {
  getJourneyTimeline,
  getAdaptiveFocus,
  getNextMilestone,
} from '../utils/journeyPlanning.js';

/**
 * Reactive journey timeline + adaptive focus for a single journey.
 */
export function useJourneyTimeline(journeyId, completedDays, totalDays) {
  const [timeline, setTimeline] = useState(() => getJourneyTimeline(journeyId));
  const [focus, setFocus] = useState(() =>
    getAdaptiveFocus(journeyId, completedDays, totalDays)
  );
  const [milestone, setMilestone] = useState(() =>
    getNextMilestone(journeyId, completedDays, totalDays)
  );

  const refresh = useCallback(() => {
    setTimeline(getJourneyTimeline(journeyId));
    setFocus(getAdaptiveFocus(journeyId, completedDays, totalDays));
    setMilestone(getNextMilestone(journeyId, completedDays, totalDays));
  }, [journeyId, completedDays, totalDays]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onStart = () => refresh();
    const onAvail = () => refresh();
    window.addEventListener('journey-start-updated', onStart);
    window.addEventListener('journey-availability-updated', onAvail);
    return () => {
      window.removeEventListener('journey-start-updated', onStart);
      window.removeEventListener('journey-availability-updated', onAvail);
    };
  }, [refresh]);

  return { timeline, focus, milestone, refresh };
}
