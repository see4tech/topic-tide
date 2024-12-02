export const formatDate = (date: string): string => {
  return date 
    ? new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';
};