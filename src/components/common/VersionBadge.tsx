import { useEffect, useState } from "react";
import { apiUrl } from "../../lib/api";

type BackendVersion = {
  version: string;
  commit: string;
  build_time: string;
};

export default function VersionBadge() {
  const frontendVersion = import.meta.env.VITE_APP_VERSION || "dev";
  const frontendCommit = import.meta.env.VITE_GIT_COMMIT || "local";
  const frontendBuildTime = import.meta.env.VITE_BUILD_TIME || "";

  const [backend, setBackend] = useState<BackendVersion | null>(null);

  useEffect(() => {
    async function loadBackendVersion() {
      try {
        const res = await fetch(apiUrl("/version"));

        if (!res.ok) return;

        const data = await res.json();
        setBackend(data);
      } catch {
        // backend unavailable
      }
    }

    void loadBackendVersion();
  }, []);

  return (
    <div className="space-y-1 text-[11px] text-zinc-500">
      <div title={`Frontend built ${frontendBuildTime}`}>
        UI v{frontendVersion} · {frontendCommit}
      </div>

      {backend ? (
        <div title={`Backend built ${backend.build_time}`}>
          API v{backend.version} · {backend.commit}
        </div>
      ) : null}
    </div>
  );
}