import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuth as useJWTAuth } from '../hooks/useAuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Signup — OG REDEGIT" }] }),
  component: SignupPage,
});

/**
 * Signup Page
 */
export function SignupPage() {
  const navigate = useNavigate();
  const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api/auth';
  const { signup, loading } = useJWTAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  /**
   * Check password strength
   */
  const checkPasswordStrength = (password: string) => {
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
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

    // Call signup
    const result = await signup(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName
    );

    if (result.success) {
      toast.success(result.message);
      setTimeout(() => {
        navigate({ to: '/verify-email-sent', search: { email: formData.email } });
      }, 1500);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Sign up to get started with OG REDEGIT</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name (Optional)</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name (Optional)</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer"
              >
                Log in
              </Link>
            </p>

            {/* Google OAuth */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = `${API_BASE}/google`;
              }}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14">
                  G
                </text>
              </svg>
              Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

