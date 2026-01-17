const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function verifyIdentity(file, walletAddress) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("wallet_address", walletAddress);
    formData.append("threshold", "700"); // Standard threshold

    const res = await fetch(`${API_URL}/verify-identity`, {
      method: "POST",
      body: formData,
      // Note: Do NOT set Content-Type header when sending FormData; 
      // the browser sets it automatically with the correct boundary.
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Backend verification failed");
    }

    // Returns: { status, analysis: {score...}, proof_data: {proof, public_signals} }
    return await res.json(); 
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}