import { createFileRoute } from "@tanstack/react-router";
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAuth as useJWTAuth } from '../hooks/useAuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — UNA CHEATX" }] }),
  component: ResetPasswordPage,
});

/**
 * Reset Password Page
 */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword, loading } = useJWTAuth();
  const search = useSearch({ from: '/reset-password' });
  const token = search?.token || '';
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resetSuccess, setResetSuccess] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  /**
   * Check password strength
   */
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Reset token not found');
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (passwordStrength < 4) {
      toast.error(
        'Password is not strong enough. Use uppercase, lowercase, numbers, and special characters'
      );
      return;
    }

    const result = await resetPassword(token, formData.password);

    if (result.success) {
      setResetSuccess(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  /**
   * Get password strength color
   */
  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Password Reset</CardTitle>
            <CardDescription>Your password has been reset successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                You can now log in with your new password.
              </p>

              <Button
                type="button"
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => navigate({ to: '/login' })}
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Invalid Link</CardTitle>
            <CardDescription>Reset token not found</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button
              type="button"
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate({ to: '/forgot-password' })}
            >
              Request New Link
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
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Create a new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
              />
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < passwordStrength ? getStrengthColor() : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Requirements: 8+ chars, uppercase, lowercase, number, special character
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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

