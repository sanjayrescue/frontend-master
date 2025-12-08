import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { backendurl } from "../feature/urldata";

const colors = {
    primary: "#12B99C",
    background: "#F8FAFC",
    accent: "#F59E0B",
    text: "#111827",
};

export function ConfirmResetForm() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");   // ✅ token from URL
    const email = queryParams.get("email");   // ✅ email from URL
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!token || !email) {
            setMessage("Invalid or missing reset link");
            return;
        }

        try {
            const res = await fetch(`${backendurl}/auth/reset-password/confirm/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword, confirmPassword }),
            });
            const data = await res.json();
            setMessage(data.message);

            if (res.ok) {
                setTimeout(() => navigate("/LoginPage"), 1500);
            }
        } catch (err) {
            setMessage("Something went wrong!");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: colors.background }}
        >
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6">
                <h2
                    className="text-2xl font-bold mb-4 text-center"
                    style={{ color: colors.text }}
                >
                    Reset Your Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: colors.primary, color: colors.text }}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: colors.primary, color: colors.text }}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg font-semibold transition-colors"
                        style={{
                            backgroundColor: colors.primary,
                            color: "#fff",
                        }}
                    >
                        Reset Password
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-center" style={{ color: colors.accent }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
