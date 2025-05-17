export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="flex gap-10">
        <section className="flex flex-col gap-10">
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
          <div>
            <h2 className="text-xl font-semibold mb-4">Theme</h2>
            <button className="bg-gray-200 px-4 py-2 rounded mr-2">Light</button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded">Dark</button>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Language</h2>
            <select className="border px-3 py-2 rounded">
              <option>English</option>
              <option>Tiếng Việt</option>
              <option>日本語</option>
            </select>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Privacy</h2>
            <label className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" />
              Make my profile private
            </label>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Account</h2>
            <p className="mb-4">
              This action is permanent. You will lose all your data. Are you sure?
            </p>
            <button className="bg-red-500 text-white px-4 py-2 rounded">Delete Account</button>
          </div>
        </section>
      </div>
    </div>
  );
}
