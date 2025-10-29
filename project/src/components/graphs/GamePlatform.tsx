interface PlatformData {
  name: string;
  count: number;
  color: string;
}

export const PlatformBar: React.FC<{ data: PlatformData[] }> = ({ data }) => {
  const total = data.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="w-full">
      <div className="flex h-8 rounded overflow-hidden">
        {data.map((platform) => {
          const width = (platform.count / total) * 100;
          return (
            <div
              key={platform.name}
              style={{
                width: `${width}%`,
                backgroundColor: platform.color,
              }}
              title={`${platform.name}: ${platform.count} games`}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-300">
        {data.map((p) => (
          <div key={p.name} className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: p.color }}
            ></span>
            <span>
              {p.name} <span className="text-gray-400">{p.count}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
