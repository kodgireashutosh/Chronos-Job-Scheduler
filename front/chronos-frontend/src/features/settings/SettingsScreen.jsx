import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { fetchSettings, saveSettings } from "./settings.api";

const SettingsScreen = () => {
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [smtpFrom, setSmtpFrom] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        if (data) {
          setSmtpHost(data.smtpHost || "");
          setSmtpPort(String(data.smtpPort || ""));
          setSmtpUser(data.smtpUser || "");
          setSmtpFrom(data.smtpFrom || "");
        }
      } catch (e) {
        // silent fail (new users may not have settings yet)
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await saveSettings({
        smtpHost,
        smtpPort: Number(smtpPort),
        smtpUser,
        smtpPassword,
        smtpFrom,
      });

      setSuccess("Settings saved successfully");
    } catch (e) {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Manage system configurations and preferences
        </p>
      </div>

      <Card className="p-8">
        <div className="mb-8 pb-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              SMTP Configuration
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Configure email settings for job notifications and reports.
            </p>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <Input
                label="SMTP Host"
                id="smtp_host"
                placeholder="smtp.sendgrid.net"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Port"
                id="smtp_port"
                placeholder="587"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Username"
                id="smtp_user"
                type="text"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Password"
                id="smtp_pass"
                type="password"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
              />
            </div>

            <div className="sm:col-span-6">
              <Input
                label="From Email Address"
                id="from_email"
                placeholder="notifications@chronos.system"
                value={smtpFrom}
                onChange={(e) => setSmtpFrom(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">
              ✅ {success}
            </div>
          )}

          <div className="pt-6 flex justify-end">
            <Button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Retention policy kept UI-only as requested */}
      <Card className="p-8">
        <div className="mb-6 pb-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Retention Policy</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage how long job execution logs are kept.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label className="block text-sm font-bold text-slate-900">
                Log Retention (Days)
              </label>
              <p className="text-xs text-slate-500 mt-1">
                Older logs will be automatically archived to cold storage.
              </p>
            </div>
            <div className="w-32">
              <input
                type="number"
                defaultValue={30}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsScreen;
