export function getOrigemBadge(origem?: string) {
  switch (origem) {
    case 'online':
      return { label: 'Online', emoji: '🌐', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0' };
    case 'cronograma':
      return { label: 'Cronograma', emoji: '🔄', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0' };
    case 'manual':
      return { label: 'Manual', emoji: '✏️', className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-0' };
    default:
      return null;
  }
}
