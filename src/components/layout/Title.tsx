const Title = ({
  title,
  description,
  accentColor = 'blue',
}: {
  title: string;
  description: string;
  accentColor?:
    | 'blue'
    | 'purple'
    | 'teal'
    | 'pink'
    | 'green'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'indigo'
    | 'cyan'
    | 'emerald'
    | 'amber'
    | 'rose'
    | 'slate';
}) => {
  const gradientMap = {
    blue: 'from-blue-700 to-blue-400',
    purple: 'from-purple-700 to-purple-400',
    teal: 'from-teal-700 to-teal-400',
    pink: 'from-pink-700 to-pink-400',
    green: 'from-green-700 to-green-400',
    red: 'from-red-700 to-red-400',
    orange: 'from-orange-700 to-orange-400',
    yellow: 'from-yellow-700 to-yellow-400',
    indigo: 'from-indigo-700 to-indigo-400',
    cyan: 'from-cyan-700 to-cyan-400',
    emerald: 'from-emerald-700 to-emerald-400',
    amber: 'from-amber-700 to-amber-400',
    rose: 'from-rose-700 to-rose-400',
    slate: 'from-slate-700 to-slate-400',
  };

  const gradient = gradientMap[accentColor];

  return (
    <div className="text-center container pt-20 pb-16 px-4 md:px-6 relative">
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-r from-${accentColor}-600/20 via-${accentColor}-500/20 to-${accentColor}-400/20 blur-[120px] -z-10 rounded-full animate-pulse-slow`}
      ></div>
      <div className="relative">
        <h1
          className={`text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient} mb-4 tracking-tight hover:scale-[1.01] transition-transform`}
        >
          {title}
        </h1>
        <p
          className={`text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed italic bg-clip-text mb-8 tracking-tight hover:scale-[1.01] transition-transform `}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export { Title };

