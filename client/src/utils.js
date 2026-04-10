/**
 * Return the first one or two initials from a display name
 * @param {string} name
 * @returns {string}  
 */
export function getInitials(name) {
  if (!name || typeof name !== "string" || !name.trim()) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Format monetary amount into human-readable string
 * Used by the animated stat counter on the Home page
 * @param {number} n
 * @returns {string}  
 */
export function fmtCompact(n) {
  if (typeof n !== "number" || isNaN(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/**
 * Generate a receipt number from a donation's creation timestamp and MongoDB id
 * @param {string} createdAt 
 * @param {string} id         
 * @returns {string}          
 */
export function generateReceiptNumber(createdAt, id) {
  if (!createdAt || !id) return "";
  const datePart = new Date(createdAt).toISOString().split("T")[0].replace(/-/g, "");
  const idPart = id.slice(-6).toUpperCase();
  return `RCPT-${datePart}-${idPart}`;
}

/**
 * Validate a donation amount against a remaining goal balance
 * @param {string|number} amount   
 * @param {number} remaining  
 * @returns {{ valid: boolean, error: string }}
 */
export function validateDonationAmount(amount, remaining = Infinity) {
  const n = Number(amount);
  if (!amount && amount !== 0) return { valid: false, error: "Please enter an amount" };
  if (isNaN(n) || n < 1) return { valid: false, error: "Please enter a valid amount (min LKR 1)" };
  if (n > remaining) return { valid: false, error: `Maximum you can donate is LKR ${remaining.toLocaleString()}` };
  return { valid: true, error: "" };
}

/**
 * Validate new password/confirm password from the profile page
 * @param {string} newPassword
 * @param {string} confirmPassword
 * @returns {{ valid: boolean, error: string }}
 */
export function validatePasswordChange(newPassword, confirmPassword) {
  if (!newPassword && !confirmPassword) return { valid: true, error: "" }; 
  if (newPassword.length < 8) return { valid: false, error: "New password must be at least 8 characters." };
  if (newPassword !== confirmPassword) return { valid: false, error: "Passwords do not match." };
  return { valid: true, error: "" };
}

/**
 * Validate the fund creation/edit form
 * @param {{ name, mission, category, targetAmount, deadline }} fields
 * @returns {{ valid: boolean, error: string }}
 */
export function validateFundForm({ name, mission, category, targetAmount, deadline }) {
  if (!name?.trim()) return { valid: false, error: "Fund name is required." };
  if (!mission?.trim()) return { valid: false, error: "Mission is required." };
  if (!category) return { valid: false, error: "Category is required." };
  if (!targetAmount || Number(targetAmount) < 1) return { valid: false, error: "A valid target amount is required." };
  if (!deadline) return { valid: false, error: "Deadline is required." };
  return { valid: true, error: "" };
}

/**
 * Calculate funding progress as a percentage
 * @param {number} raised
 * @param {number} target
 * @returns {number}
 */
export function fundingProgress(raised, target) {
  if (!target || target <= 0) return 0;
  return Math.min((raised / target) * 100, 100);
}

/**
 * Calculate the average star rating from a list of feedbacks
 * @param {{ rating: number }[]} feedbackList
 * @returns {string|null}  
 */
export function avgRating(feedbackList) {
  if (!feedbackList || feedbackList.length === 0) return null;
  const sum = feedbackList.reduce((acc, f) => acc + (f.rating || 0), 0);
  return (sum / feedbackList.length).toFixed(1);
}