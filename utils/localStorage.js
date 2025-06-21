const isClient = typeof window !== 'undefined';

export function getItem(key) {
  if (!isClient) return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error('Error getting localStorage item', error);
    return null;
  }
}

export function setItem(key, value) {
  if (!isClient) return;
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting localStorage item', error);
  }
}

export function removeItem(key) {
  if (!isClient) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage item', error);
  }
}
