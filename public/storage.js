// Local storage key
const TRANSACTIONS_STORAGE_KEY = "expense_tracker_transactions";

// Get transactions from local storage
export function getStoredTransactions() {
  try {
    const transactionsJSON = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    const transactions = transactionsJSON ? JSON.parse(transactionsJSON) : [];
    console.log("Retrieved from storage:", transactions);
    return transactions;
  } catch (error) {
    console.error("Error getting transactions from storage:", error);
    return [];
  }
}

// Save transactions to local storage
export function storeTransactions(transactions) {
  try {
    console.log("Saving to storage:", transactions);
    localStorage.setItem(
      TRANSACTIONS_STORAGE_KEY,
      JSON.stringify(transactions)
    );
    return true;
  } catch (error) {
    console.error("Error storing transactions:", error);
    return false;
  }
}
