export default function Analytics() {
  const data = [
    { name: "SQLi", value: 32 },
    { name: "XSS", value: 68 },
    { name: "PCAP", value: 84 },
  ];

  return (
    <div className="card">
      <h3>Success Rate</h3>

      {data.map((d, i) => (
        <div key={i} className="bar-row">
          <span>{d.name}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${d.value}%` }}
            />
          </div>
          <span>{d.value}%</span>
        </div>
      ))}
    </div>
  );
}