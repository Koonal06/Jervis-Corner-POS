import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";

interface LoginProps {
  onLogin: (role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin");

  const roles = [
    {
      value: "admin",
      label: "Admin",
      color: "from-primary to-secondary",
    },
    {
      value: "cashier",
      label: "Cashier",
      color: "from-secondary to-primary",
    },
    {
      value: "chef",
      label: "Chef",
      color: "from-accent to-primary-dark",
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-8" style={{ backgroundColor: '#263744' }}>
      <div className="w-full max-w-md">
        {/* Logo Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-lg mb-6">
              <UtensilsCrossed className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-accent text-center mb-2 text-2xl sm:text-3xl">
              Jervis Corner
            </h1>
            <p className="text-neutral-500 text-sm sm:text-base text-center">Management Information System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2 pt-1">
              <label className="block text-sm font-medium text-neutral-700">
                Login As
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`py-3 px-2 rounded-2xl font-medium transition-all text-sm ${
                      selectedRole === role.value
                        ? `bg-gradient-to-br ${role.color} text-white shadow-md scale-105`
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:scale-[1.02]"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] mt-6 text-base"
            >
              Login
            </button>
          </form>

          <p className="text-center text-neutral-500 text-xs sm:text-sm mt-6">
            Demo: Use any credentials to login
          </p>
        </div>
      </div>
    </div>
  );
}
