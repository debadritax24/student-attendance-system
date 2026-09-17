export default function RouteLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        color: "var(--text-muted)",
        gap: 12,
      }}
    >
      <div style={{
        width: 20,
        height: 20,
        border: "2px solid var(--border)",
        borderTopColor: "var(--primary)",
        borderRadius: "50%",
        animation: "spin 0.6s linear infinite",
      }} />
      <span>Loading...</span>
    </div>
  );
}
