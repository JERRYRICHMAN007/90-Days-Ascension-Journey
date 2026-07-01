/**
 * Offline mutation queue — flush on reconnect / after sign-in.
 * Mutations are stored in localStorage under forge90_offline_queue.
 */

const QUEUE_KEY = 'forge90_offline_queue';

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeQueue(items) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

export function enqueueOfflineMutation(mutation) {
  const queue = readQueue();
  queue.push({ ...mutation, queuedAt: Date.now() });
  writeQueue(queue);
}

export async function flushQueue() {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return;

  const queue = readQueue();
  if (!queue.length) return;

  const { api } = await import('../services/api.js');
  const remaining = [];

  for (const item of queue) {
    try {
      if (item.type === 'completeTask' && item.domain != null && item.dayNumber != null) {
        await api.completeTask(item.domain, item.dayNumber, item.completed !== false);
      } else if (item.type === 'updateXP' && item.payload) {
        await api.updateXP(item.payload);
      } else if (item.type === 'updateStreaks' && item.payload) {
        await api.updateStreaks(item.payload);
      }
    } catch (error) {
      console.warn('Forge90: offline queue item failed, will retry later', item, error);
      remaining.push(item);
    }
  }

  writeQueue(remaining);
}
