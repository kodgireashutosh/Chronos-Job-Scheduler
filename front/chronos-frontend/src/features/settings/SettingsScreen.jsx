import { Mail } from 'lucide-react';
import Card from '../../components/Card'; 
import Input from '../../components/Input'; 
import Button from '../../components/Button';



const SettingsScreen = () => {
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
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <Input
                label="SMTP Host"
                id="smtp_host"
                placeholder="smtp.sendgrid.net"
              />
            </div>
            <div className="sm:col-span-2">
              <Input label="Port" id="smtp_port" placeholder="587" />
            </div>
            <div className="sm:col-span-3">
              <Input label="Username" id="smtp_user" type="text" />
            </div>
            <div className="sm:col-span-3">
              <Input label="Password" id="smtp_pass" type="password" />
            </div>
            <div className="sm:col-span-6">
              <Input
                label="From Email Address"
                id="from_email"
                placeholder="notifications@chronos.system"
              />
            </div>
          </div>
          <div className="pt-6 flex justify-end">
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

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
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                defaultValue={30}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsScreen;