'use client'
import { useState } from "react"

const settingsList = [
  { key: "profile", label: "Profile" },
  { key: "security", label: "Security" },
  { key: "notifications", label: "Notifications" },
  { key: "theme", label: "Theme" },
  { key: "language", label: "Language" },
  { key: "privacy", label: "Privacy" },
  { key: "delete", label: "Delete Account" },
]

export default function SettingsPage() {
  const [selected, setSelected] = useState("profile")

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="flex gap-8">
        <aside className="w-1/4">
          <ul className="space-y-2">
            {settingsList.map(item => (
              <li key={item.key}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selected === item.key
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelected(item.key)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="flex-1">
          {selected === "profile" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <input className="border px-3 py-2 rounded w-full mb-3" placeholder="Username" />
              <input className="border px-3 py-2 rounded w-full mb-3" placeholder="Email" />
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </div>
          )}
          {selected === "security" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Security</h2>
              <input className="border px-3 py-2 rounded w-full mb-3" placeholder="Current password" type="password" />
              <input className="border px-3 py-2 rounded w-full mb-3" placeholder="New password" type="password" />
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Change Password</button>
            </div>
          )}
          {selected === "notifications" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              <label className="flex items-center mb-2">
                <input type="checkbox" className="mr-2" />
                Email notifications
              </label>
              <label className="flex items-center mb-2">
                <input type="checkbox" className="mr-2" />
                Push notifications
              </label>
            </div>
          )}
          {selected === "theme" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Theme</h2>
              <button className="bg-gray-200 px-4 py-2 rounded mr-2">Light</button>
              <button className="bg-gray-800 text-white px-4 py-2 rounded">Dark</button>
            </div>
          )}
          {selected === "language" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Language</h2>
              <select className="border px-3 py-2 rounded">
                <option>English</option>
                <option>Tiếng Việt</option>
                <option>日本語</option>
              </select>
            </div>
          )}
          {selected === "privacy" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Privacy</h2>
              <label className="flex items-center mb-2">
                <input type="checkbox" className="mr-2" />
                Make my profile private
              </label>
            </div>
          )}
          {selected === "delete" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Account</h2>
              <p className="mb-4">This action is permanent. You will lose all your data. Are you sure?</p>
              <button className="bg-red-500 text-white px-4 py-2 rounded">Delete Account</button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
