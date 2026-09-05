import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useAuth as useJWTAuth } from '../hooks/useAuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  head: () => ({ meta: [{ title: "Verify Email — OG REDEGIT" }] }),
  component: VerifyEmailPage,
});

/**
 * Email Verification Page
 */
export function VerifyEmailPage() {
  const navigate = useNavigate();
  const { verifyEmail } = useJWTAuth();
  const search = useSearch({ from: '/verify-email' });
  const token = search?.token || '';
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Verify email on page load
   */
  useEffect(() => {
    if (!token) {
      setError('Verification token not found');
      setLoading(false);
      return;
    }

    const performVerification = async () => {
      const result = await verifyEmail(token);

      if (result.success) {
        setVerified(true);
        toast.success(result.message);
      } else {
        setError(result.message);
        toast.error(result.message);
      }

      setLoading(false);
    };

    performVerification();
  }, [token, verifyEmail]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 bg-purple-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          {verified ? (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Email Verified!</CardTitle>
              <CardDescription>Your account is now fully activated</CardDescription>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl">Verification Failed</CardTitle>
              <CardDescription>We couldn't verify your email</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {verified ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your email has been verified successfully. You can now log in and start using all
                features of OG REDEGIT.
              </p>

              <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  <strong>Account Status:</strong> Active
                </p>
              </div>

              <Link to="/login" className="w-full block">
                <Button
                  type="button"
                  className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer"
                >
                  Go to Login
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{error}</p>

              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold">Possible reasons:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Token expired (valid for 24 hours)</li>
                    <li>Token already used</li>
                    <li>Invalid token</li>
                  </ul>
                </div>
              </div>

              <Link to="/login" className="w-full block">
                <Button
                  type="button"
                  className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer"
                >
                  Back to Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

