// Utility function to get or generate a guest ID
// This ID persists in localStorage so orders can be tracked per browser

export const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");
  
  if (!guestId) {
    // Generate a unique guest ID
    guestId = "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("guestId", guestId);
  }
  
  return guestId;
};
