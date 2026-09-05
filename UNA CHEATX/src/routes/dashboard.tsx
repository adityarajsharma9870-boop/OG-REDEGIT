import { createFileRoute } from "@tanstack/react-router";
import { useAuth as useJWTAuth } from '../hooks/useAuthContext';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useJWTAuth();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      {/* Header */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">OG REDEGIT</h1>
            <p className="text-sm text-gray-300">Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white">{user?.email}</span>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-white border-white/30 hover:bg-white/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Card */}
          <Card className="border-purple-400/20 bg-white/5 backdrop-blur">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome, {user?.firstName || user?.email}!
              </h2>
              <p className="text-gray-300">
                Your account has been successfully authenticated.
              </p>
            </CardContent>
          </Card>

          {/* User Info Card */}
          <Card className="border-purple-400/20 bg-white/5 backdrop-blur">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-white mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                  <span className="text-gray-300">Email</span>
                  <span className="text-white font-semibold">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                  <span className="text-gray-300">First Name</span>
                  <span className="text-white font-semibold">{user?.firstName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                  <span className="text-gray-300">Last Name</span>
                  <span className="text-white font-semibold">{user?.lastName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                  <span className="text-gray-300">Role</span>
                  <span className="text-white font-semibold capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                  <span className="text-gray-300">Email Verified</span>
                  <span className="text-green-400 font-semibold">✓ Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="border-purple-400/20 bg-white/5 backdrop-blur">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-white mb-4">Authentication Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> Secure JWT Authentication
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> Email Verification
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> Password Reset with Email
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> Google OAuth Integration
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> HTTP-Only Cookies
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> Rate Limiting
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Admin Features */}
          {user?.role === 'admin' && (
            <Card className="border-blue-400/20 bg-blue-500/5 backdrop-blur">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-white mb-4">🔐 Admin Panel</h3>
                <p className="text-gray-300 mb-4">
                  You have admin access to this application.
                </p>
                <Button
                  onClick={() => navigate({ to: '/admin' })}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Go to Admin Panel
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard – OG REDEGIT" }] }),
  component: DashboardPage,
});
