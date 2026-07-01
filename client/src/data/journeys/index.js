import { journeys } from './shared.js';
import { bodyTransformationWeeks } from './bodyTransformation.js';
import { dualBrandWeeks } from './dualBrand.js';
import { readingWeeks } from './reading.js';
import { writersWeeks } from './writers.js';
import { softwareEngineeringWeeks } from './softwareEngineering.js';

export { journeys } from './shared.js';
export {
  bodyTransformationWeeks,
} from './bodyTransformation.js';
export { readingWeeks } from './reading.js';
export { dualBrandWeeks } from './dualBrand.js';
export { writersWeeks } from './writers.js';
export { softwareEngineeringWeeks } from './softwareEngineering.js';
export {
  getSkillResources,
  getSkillQuiz,
  getSkillTopics,
  getSoftwareEngineeringReflection,
  getProjectComponentForDay,
  getDisciplineResources,
} from './softwareEngineering.js';

export function getJourneyData(journeyId) {
  switch (journeyId) {
    case "body-transformation":
      return { weeks: bodyTransformationWeeks, journey: journeys[0] };
    case "dual-brand":
      return { weeks: dualBrandWeeks, journey: journeys[1] };
    case "reading":
      return { weeks: readingWeeks, journey: journeys[2] };
    case "writers":
      return { weeks: writersWeeks, journey: journeys[3] };
    case "software-engineering":
      return { weeks: softwareEngineeringWeeks, journey: journeys[4] };
    default:
      return { weeks: [], journey: null };
  }
}
