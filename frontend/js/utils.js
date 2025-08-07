
function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj)) return dateStr;
  return dateObj.toLocaleDateString(undefined, options);
}


function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}



