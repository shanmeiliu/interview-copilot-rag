import { useState } from "react";
import { useAuth } from "../../app/auth";
import { QRCodeSVG } from "qrcode.react";
import PageHeader from "../../components/common/PageHeader";
import { confirmMFA, disableMFA, setupMFA } from "../../lib/api";

export default function SettingsPage() {
  const { user, refreshSession } = useAuth();

  const [secret, setSecret] = useState("");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSetupMFA() {
    try {
      setBusy(true);
      setError("");
      setMessage("");

      const result = await setupMFA();

      setSecret(result.secret);
      setOtpauthUrl(result.otpauth_url);
      setMessage(
        "MFA setup started. Add the secret to your authenticator app, then enter the 6-digit code."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start MFA setup");
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirmMFA() {
    if (!code.trim()) {
      setError("Please enter the 6-digit authenticator code.");
      return;
    }

    try {
      setBusy(true);
      setError("");
      setMessage("");

      await confirmMFA(code.trim());
      await refreshSession();

      setCode("");
      setSecret("");
      setOtpauthUrl("");
      setMessage("MFA enabled successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm MFA");
    } finally {
      setBusy(false);
    }
  }

  async function handleDisableMFA() {
    const ok = window.confirm(
      "Disable MFA for this admin account?\n\nOnly do this if you understand the security risk."
    );

    if (!ok) return;

    try {
      setBusy(true);
      setError("");
      setMessage("");

      await disableMFA();
      await refreshSession();

      setSecret("");
      setOtpauthUrl("");
      setCode("");
      setMessage("MFA disabled.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disable MFA");
    } finally {
      setBusy(false);
    }
  }

  const mfaEnabled = !!user?.mfa_enabled;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <PageHeader
        title="Settings"
        description="Configure admin security, answer policy, providers, reranker, and retrieval behavior."
      />

      <div className="space-y-6 p-6">
        {message ? (
          <div className="rounded-2xl border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-zinc-100">
                  Admin MFA
                </h2>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                    mfaEnabled
                      ? "border-emerald-900 bg-emerald-950 text-emerald-300"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {mfaEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                Enable authenticator-app MFA for the current admin account.
                Use Google Authenticator, Microsoft Authenticator, Authy,
                1Password, or another TOTP-compatible app.
              </p>

              {user?.mfa_confirmed_at ? (
                <p className="mt-2 text-xs text-zinc-500">
                  Confirmed at:{" "}
                  {new Date(user.mfa_confirmed_at).toLocaleString()}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => void handleSetupMFA()}
                disabled={busy}
                className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mfaEnabled ? "Reset MFA" : "Enable MFA"}
              </button>

              <button
                onClick={() => void handleDisableMFA()}
                disabled={busy || !mfaEnabled}
                className="rounded-xl border border-red-900 px-4 py-2 text-sm text-red-300 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Disable MFA
              </button>
            </div>
          </div>

          {secret || otpauthUrl ? (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-sm font-semibold text-zinc-100">
                Authenticator Setup
              </h3>

              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-400">
                <li>Open your authenticator app.</li>
                <li>Add a new account manually.</li>
                <li>Use the secret below.</li>
                <li>Enter the 6-digit code to confirm MFA.</li>
              </ol>

              <div className="mt-4 space-y-3">

                    {otpauthUrl ? (
                      <div className="mb-5 flex justify-center">
                        <div className="rounded-2xl border border-zinc-800 bg-white p-4 shadow-lg">
                          <QRCodeSVG value={otpauthUrl} size={180} />
                        </div>
                      </div>
                    ) : null}

                    <label className="block text-sm text-zinc-400">
                      Secret
                  <input
                    value={secret}
                    readOnly
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 outline-none"
                  />
                </label>

                <label className="block text-sm text-zinc-400">
                  otpauth URL
                  <textarea
                    value={otpauthUrl}
                    readOnly
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-100 outline-none"
                  />
                </label>

                <label className="block text-sm text-zinc-400">
                  6-digit code
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    inputMode="numeric"
                    className="mt-1 w-full max-w-xs rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none"
                  />
                </label>

                <button
                  onClick={() => void handleConfirmMFA()}
                  disabled={busy}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Confirm MFA
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-base font-semibold text-zinc-100">
            Other Settings
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Placeholder: provider settings, answer policy, reranker, HNSW,
            retrieval tuning.
          </p>
        </section>
      </div>
    </div>
  );
}