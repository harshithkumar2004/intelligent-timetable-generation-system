// Helper utility functions

/**
 * Generate a unique ID
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Format time string (e.g., "08:30" to "8:30 AM")
 */
export const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Generate a random color for subject
 */
export const generateRandomColor = (): string => {
  const colors = [
    '#2563EB', // Blue
    '#0D9488', // Teal
    '#7C3AED', // Purple
    '#EA580C', // Orange
    '#16A34A', // Green
    '#DC2626', // Red
    '#CA8A04', // Yellow
    '#C026D3', // Fuchsia
    '#0369A1', // Cyan
    '#4F46E5', // Indigo
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Get lighter version of a color for backgrounds
 */
export const getLightColor = (hexColor: string): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Mix with white (80% white, 20% original)
  const lighterR = Math.round(r * 0.2 + 255 * 0.8);
  const lighterG = Math.round(g * 0.2 + 255 * 0.8);
  const lighterB = Math.round(b * 0.2 + 255 * 0.8);
  
  // Convert back to hex
  return `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;
};

/**
 * Save state to local storage
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load state from local storage
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Download data as a JSON file
 */
export const downloadJson = (data: unknown, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};