export default function VersionBadge() {
  const version = import.meta.env.VITE_APP_VERSION || "dev";
  const commit = import.meta.env.VITE_GIT_COMMIT || "local";
  const buildTime = import.meta.env.VITE_BUILD_TIME || "";

  return (
    <div
      title={buildTime}
      className="text-[11px] text-zinc-500"
    >
      v{version} · {commit}
    </div>
  );
}