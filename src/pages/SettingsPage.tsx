// src/pages/SettingsPage.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { logout } = useAuth();
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">⚙️ Settings</h1>

      {/* Theme Toggle */}
      <div className="mb-4 flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <span className="font-medium">Theme</span>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Notifications Toggle */}
      <div className="mb-4 flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <span className="font-medium">Notifications</span>
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
          className="w-5 h-5"
        />
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
