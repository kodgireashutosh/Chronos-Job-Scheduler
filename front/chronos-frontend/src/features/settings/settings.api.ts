import { api } from "@/lib/api";

export async function fetchSettings() {
  const res = await api.get("/settings/smtp");
  return res.data;
}

export async function saveSettings(data: {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpFrom: string;
}) {
  const res = await api.post("/settings/smtp", data);
  return res.data;
}
