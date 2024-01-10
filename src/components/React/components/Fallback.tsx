export const Fallback = ({ isFallback }: { isFallback?: boolean }) => {
  return (
    <div
      className={isFallback ? "home-container-fallback" : ""}
      style={{
        fontSize: 24,
        zIndex: 1000,
        color: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "50%" }}>
        <div style={{ marginBottom: "4vh" }}>Welcome.</div>
        <div>I am Ivan Radev,</div>

        <div style={{ marginBottom: "4vh" }}>
          a creative, full-stack developer based in Bulgaria
        </div>
        <div style={{ marginBottom: "4vh" }}>
          I weave visions into reality since 2007.
        </div>
        <div>This showcase website is made with Astro</div>
        <div>+ React / Angular / Svelte / Vue / HTMX</div>
        <div style={{ marginTop: "8vh", textAlign: "center" }}>
          Press the Info button for more.
        </div>
      </div>
    </div>
  );
};
