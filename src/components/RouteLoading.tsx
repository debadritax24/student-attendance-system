export default function RouteLoading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        color: "var(--text-muted)",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          border: "2.5px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.6s linear infinite",
        }}
      />
      <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>Loading view...</span>
    </div>
  );
}
