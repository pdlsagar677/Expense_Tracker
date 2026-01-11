"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function DeleteAccount() {
  const router = useRouter();
  const { deleteAccount, message, error, isLoading } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = () => {
    if (!password) return;
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount(password);
      router.push("/login");
    } catch (e) {}
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.header}>Delete Account</h2>

      <p style={styles.warning}>
        This action is permanent. All of your expenses and salary history will be deleted.
      </p>

      <input
        type="password"
        placeholder="Enter password to confirm"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        style={styles.deleteBtn}
      >
        {isLoading ? "Processing..." : "Delete Account"}
      </button>

      {error && <p style={styles.error}>{error}</p>}
      {message && <p style={styles.success}>{message}</p>}

      {confirmOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ marginBottom: 8 }}>Confirm Deletion</h3>
            <p>Are you sure you want to delete your account?</p>
            <p>This cannot be undone.</p>

            <div style={styles.row}>
              <button style={styles.cancelBtn} onClick={() => setConfirmOpen(false)}>
                Cancel
              </button>
              <button style={styles.confirmBtn} onClick={handleConfirmDelete}>
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, any> = {
  wrapper: {
    maxWidth: 420,
    margin: "60px auto",
    padding: 24,
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "white",
  },
  header: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 12,
  },
  warning: {
    fontSize: 14,
    color: "#a55",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: 6,
    marginBottom: 16,
  },
  deleteBtn: {
    width: "100%",
    padding: "10px 12px",
    background: "#c0392b",
    border: "none",
    color: "white",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  success: {
    color: "green",
    marginTop: 10,
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: 360,
    background: "white",
    padding: 24,
    borderRadius: 8,
    textAlign: "center",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    padding: "8px 14px",
    borderRadius: 6,
    border: "1px solid #aaa",
    cursor: "pointer",
    background: "#eee",
  },
  confirmBtn: {
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    background: "#c0392b",
    color: "white",
    cursor: "pointer",
  },
};
