
import { Clock } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

const SignupScreen = ({ onNavigate }) => (
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
      <h2 className="text-center text-2xl font-bold text-slate-900">
        Create Account
      </h2>
      <p className="text-center text-slate-500 text-sm mt-2">
        Get started with distributed scheduling
      </p>
    </div>

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card className="py-8 px-4 sm:px-10 shadow-lg">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onNavigate("login");
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              id="first_name"
              placeholder="John"
              required
            />
            <Input
              label="Last Name"
              id="last_name"
              placeholder="Doe"
              required
            />
          </div>
          <Input
            label="Email address"
            id="email"
            type="email"
            placeholder="john@company.com"
            required
          />
          <Input label="Password" id="password" type="password" required />
          <Input
            label="Confirm Password"
            id="confirm_password"
            type="password"
            required
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Sign Up
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate("login")}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Already have an account? Sign in
          </button>
        </div>
      </Card>
    </div>
  </div>
);

export default SignupScreen;