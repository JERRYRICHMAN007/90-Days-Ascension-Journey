import { useParams } from 'react-router-dom';

import { JourneyAnalyticsDetail } from '../components/analytics/JourneyAnalyticsDetail.jsx';

import { AnalyticsAllJourneysOverview } from '../components/analytics/AnalyticsAllJourneysOverview.jsx';

import { JOURNEY_IDS } from '../utils/tracing.js';



export function AnalyticsPage() {

  const { journeyId } = useParams();



  if (journeyId && JOURNEY_IDS.includes(journeyId)) {

    return <JourneyAnalyticsDetail journeyId={journeyId} />;

  }



  return <AnalyticsAllJourneysOverview />;

}

