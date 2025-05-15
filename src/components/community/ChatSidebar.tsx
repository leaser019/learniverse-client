export default function ChatSidebar({ groups, users, selected, onSelect }: any) {
  return (
    <aside className="w-56">
      <h3 className="font-bold mb-4">Groups</h3>
      <ul className="space-y-2 mb-6">
        {groups.map((g: any) => (
          <li key={g.id}>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${selected.type === 'group' && selected.id === g.id ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'}`}
              onClick={() => onSelect('group', g.id)}
            >
              {g.name}
            </button>
          </li>
        ))}
      </ul>
      <h3 className="font-bold mb-4">Direct Messages</h3>
      <ul className="space-y-2">
        {users.map((u: any) => (
          <li key={u.id}>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${selected.type === 'user' && selected.id === u.id ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'}`}
              onClick={() => onSelect('user', u.id)}
            >
              {u.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
