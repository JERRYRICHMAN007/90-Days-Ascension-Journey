import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'src', 'data');
const journeysDir = path.join(src, 'journeys');
const sourceFile = path.join(src, 'journeyData.js');

const lines = fs.readFileSync(sourceFile, 'utf8').split(/\r?\n/);

function extractLineRange(start, end) {
  return lines.slice(start - 1, end).join('\n');
}

function writeFile(relPath, content) {
  const fullPath = path.join(src, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Created ${relPath} (${content.split('\n').length} lines)`);
}

// 1. shared.js - lines 4-115 with exports and totalDays change
let sharedContent = extractLineRange(4, 115);
sharedContent = sharedContent.replace(
  /id: "software-engineering"[\s\S]*?totalDays: 90,/,
  (match) => match.replace('totalDays: 90,', 'totalDays: 180,')
);
sharedContent = sharedContent.replace(
  'const JOURNEY_START_DATE',
  'export const JOURNEY_START_DATE'
);
sharedContent = sharedContent.replace(
  'function formatLocalDateString',
  'export function formatLocalDateString'
);
sharedContent = sharedContent.replace(
  'function getDateStringForDayNumber',
  'export function getDateStringForDayNumber'
);
sharedContent = sharedContent.replace(
  'function generateWeeks',
  'export function generateWeeks'
);
sharedContent = sharedContent.replace(
  'function getWeekTheme',
  'export function getWeekTheme'
);

writeFile('journeys/shared.js', sharedContent + '\n');

// 2. bodyTransformation.js - lines 117-669
const bodyContent = `import {
  JOURNEY_START_DATE,
  generateWeeks,
  getDateStringForDayNumber,
} from './shared.js';
import {
  getBodyTransformationTimeBlocks,
  organizeBodyTransformationSchedule,
  getBodyTransformationQuiz,
} from './softwareEngineering.js';

${extractLineRange(117, 669)}
`;

writeFile('journeys/bodyTransformation.js', bodyContent);

// 3. reading.js - lines 237-366 + 670-1065
const readingContent = `import {
  JOURNEY_START_DATE,
  generateWeeks,
  getDateStringForDayNumber,
} from './shared.js';
import {
  getReadingTimeBlocks,
  organizeReadingSchedule,
  getReadingQuiz,
} from './softwareEngineering.js';

${extractLineRange(237, 366)}

${extractLineRange(670, 1065)}
`;

writeFile('journeys/reading.js', readingContent);

// 4. dualBrand.js - lines 368-400 + 1066-3350
const dualBrandContent = `import { getExecutionTasks } from '../dualBrandExecutionPlan.js';
import {
  JOURNEY_START_DATE,
  generateWeeks,
  getDateStringForDayNumber,
} from './shared.js';
import {
  getDualBrandTimeBlocks,
  organizeDualBrandSchedule,
  getDualBrandQuiz,
  getPlatformSessions,
} from './softwareEngineering.js';

${extractLineRange(368, 400)}

${extractLineRange(1066, 3350)}
`;

writeFile('journeys/dualBrand.js', dualBrandContent);

// 5. writers.js - lines 3351-5160
let writersBody = extractLineRange(3351, 5160);
writersBody = writersBody.replace(
  'const DISCIPLINE_PROJECTS =',
  'export const DISCIPLINE_PROJECTS ='
);
writersBody = writersBody.replace(
  'const TRANSPORT_APP_PROJECT =',
  'export const TRANSPORT_APP_PROJECT ='
);
writersBody = writersBody.replace(
  'function getBuildPhaseForWeek',
  'export function getBuildPhaseForWeek'
);
writersBody = writersBody.replace(
  'function getProjectComponentForDay',
  'export function getProjectComponentForDay'
);

const writersContent = `import {
  JOURNEY_START_DATE,
  generateWeeks,
  getDateStringForDayNumber,
} from './shared.js';
import {
  getWritersTimeBlocks,
  organizeWritersSchedule,
  getWriterQuiz,
} from './softwareEngineering.js';

${writersBody}
`;

writeFile('journeys/writers.js', writersContent);

// 6. softwareEngineering.js - 5161-12986 + 13003-13280, import shared + getProjectComponentForDay from writers
let sePart1 = extractLineRange(5161, 12986);
sePart1 = sePart1.replace(
  'export { getSoftwareEngineeringReflection, getProjectComponentForDay, getDisciplineResources };',
  'export { getSoftwareEngineeringReflection, getDisciplineResources };'
);
const sePart2 = extractLineRange(13003, 13280);

const seContent = `import {
  JOURNEY_START_DATE,
  generateWeeks,
  getDateStringForDayNumber,
} from './shared.js';
import {
  getProjectComponentForDay,
  DISCIPLINE_PROJECTS,
  TRANSPORT_APP_PROJECT,
  getBuildPhaseForWeek,
} from './writers.js';

${sePart1}

${sePart2}

export { getProjectComponentForDay };
export {
  getBodyTransformationTimeBlocks,
  organizeBodyTransformationSchedule,
  getBodyTransformationQuiz,
  getReadingTimeBlocks,
  organizeReadingSchedule,
  getReadingQuiz,
  getDualBrandTimeBlocks,
  organizeDualBrandSchedule,
  getDualBrandQuiz,
  getWritersTimeBlocks,
  organizeWritersSchedule,
  getWriterQuiz,
  getPlatformSessions,
};
`;

writeFile('journeys/softwareEngineering.js', seContent);

// 7. index.js - getJourneyData
const indexContent = `import { journeys } from './shared.js';
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

${extractLineRange(12987, 13002)}
`;

writeFile('journeys/index.js', indexContent);

// 8. Replace journeyData.js with thin re-export
writeFile('journeyData.js', "export * from './journeys/index.js';\n");

console.log('\nSplit complete.');
