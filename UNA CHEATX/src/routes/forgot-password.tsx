import { createFileRoute } from "@tanstack/react-router";
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth as useJWTAuth } from '../hooks/useAuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password — OG REDEGIT" }] }),
  component: ForgotPasswordPage,
});

/**
 * Forgot Password Page
 */
export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useJWTAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    const result = await forgotPassword(email);

    if (result.success) {
      setSubmitted(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>Password reset link sent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                If an account exists with the email <strong>{email}</strong>, you will receive a
                password reset link within minutes.
              </p>

              <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800">
                  <p className="font-semibold">Link expires in 1 hour</p>
                  <p>Make sure to reset your password within this time.</p>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                <strong>Tip:</strong> Check your spam folder if you don't see the email.
              </p>
            </div>

            <Button
              type="button"
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate({ to: '/login' })}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            {/* Back to Login */}
            <p className="text-center text-sm text-gray-600">
              <button
                type="button"
                onClick={() => navigate({ to: '/login' })}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Back to Login
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

