/** Lightweight localStorage-backed task store (replaces deleted FocusedImplementationTasks) */
const KEY = 'Aether_focused_tasks';

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const focusedImplementationDB = {
  getTasksByDay(dayNumber, journeyId) {
    return readAll().filter(
      (t) => t.dayNumber === dayNumber && t.journeyId === journeyId
    );
  },
};
