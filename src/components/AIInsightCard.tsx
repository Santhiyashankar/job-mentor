type Props = {
  insight: string;
};

export default function AIInsightCard({ insight }: Props) {
  const sections = insight.split("###").filter(Boolean);

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => {
        const [title, ...content] = section.split("\n");
        return (
          <div
            key={idx}
            className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-600"
          >
            <h3 className="font-semibold text-lg mb-2">
              {title.trim()}
            </h3>
            <ul className="list-disc pl-5 text-slate-700 space-y-1">
              {content
                .filter(line => line.startsWith("-"))
                .map((line, i) => (
                  <li key={i}>{line.replace("-", "").trim()}</li>
                ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
