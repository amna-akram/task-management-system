export const getCurrentDateTime = () => {
  const currentDate = new Date();

  // Format the date and time strings
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour12: false,
  });

  return `${formattedDate} ${formattedTime}`;
}