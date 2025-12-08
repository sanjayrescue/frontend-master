import { useState } from "react";
import { backendurl } from "../feature/urldata";

const colors = {
    primary: "#12B99C",
    background: "#F8FAFC",
    accent: "#F59E0B",
    text: "#111827",
};

export function RequestResetForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch(`${backendurl}/auth/reset-password/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            setMessage(data.message);
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
                    Request Password Reset
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        style={{
                            borderColor: colors.primary,
                            color: colors.text,
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        Send Reset Link
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