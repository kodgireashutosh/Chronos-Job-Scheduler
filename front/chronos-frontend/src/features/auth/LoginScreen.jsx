import { Clock } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
const LoginScreen = ({ onLogin, onNavigate }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center items-center gap-3 mb-8">
        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
          <Clock className="text-white w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Chronos
        </h2>
      </div>
      <h2 className="text-center text-2xl font-bold text-slate-900 mb-2">
        Sign in to your dashboard
      </h2>
      <p className="text-center text-slate-500 text-sm mb-8">
        Enter your credentials to access the system
      </p>
    </div>

    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <Card className="py-8 px-4 sm:px-10 border-slate-200 shadow-lg">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
        >
          <Input
            label="Work Email"
            id="email"
            type="email"
            placeholder="name@company.com"
            required
          />
          <Input label="Password" id="password" type="password" required />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-700"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={() => onNavigate("forgot-password")}
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 text-base"
          >
            Sign in
          </Button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-slate-500">
                Don't have an account?
              </span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate("signup")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              Create an account
            </button>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

export default LoginScreen;