// Check if localStorage is available and working
export function checkStorageAvailability() {
  const test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Display storage status on the page
export function displayStorageStatus() {
  const statusElement = document.getElementById("storage-available");
  if (!statusElement) return;

  const isAvailable = checkStorageAvailability();
  statusElement.textContent = isAvailable ? "Available" : "Not Available";
  statusElement.style.color = isAvailable ? "green" : "red";

  if (!isAvailable) {
    console.error(
      "Local storage is not available. Transactions cannot be saved."
    );
    alert(
      "Warning: Local storage is not available. Your transactions will not be saved between sessions. This could be due to private browsing mode or browser settings."
    );
  }
}
