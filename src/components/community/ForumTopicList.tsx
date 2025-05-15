export default function ForumTopicList({ topics, selected, onSelect }: any) {
  return (
    <aside className="w-60 bg-gradient-to-b from-blue-50/80 to-cyan-50/60 dark:from-blue-900/30 dark:to-cyan-900/20 rounded-2xl shadow-lg p-4 flex flex-col gap-2 border border-border/30">
      <h3 className="font-bold text-lg mb-4 text-blue-700 dark:text-cyan-300 tracking-tight">Topics</h3>
      <ul className="space-y-2">
        {topics.map((t: any) => (
          <li key={t.id}>
            <button
              className={`w-full text-left px-4 py-2 rounded-xl font-medium transition-all duration-200 ${selected === t.id ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow scale-105' : 'hover:bg-blue-100/80 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200'}`}
              onClick={() => onSelect(t.id)}
            >
              {t.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
