import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuth as useJWTAuth } from '../hooks/useAuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute("/verify-email-sent")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === 'string' ? search.email : '',
  }),
  head: () => ({ meta: [{ title: "Verify Email Sent — OG REDEGIT" }] }),
  component: VerifyEmailSentPage,
});

/**
 * Email Verification Sent Page
 */
export function VerifyEmailSentPage() {
  const navigate = useNavigate();
  const { resendVerificationEmail } = useJWTAuth();
  const search = useSearch({ from: '/verify-email-sent' });
  const email = search?.email || '';
  const [resending, setResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  /**
   * Handle resend verification email
   */
  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Email not found');
      return;
    }

    setResending(true);
    try {
      const result = await resendVerificationEmail(email);

      if (result.success) {
        setResendCount((prev) => prev + 1);
        toast.success('Verification email sent! Check your inbox.');
      } else {
        toast.error(result.message);
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>Verification email sent to {email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              We've sent a verification link to your email. Click the link to verify your account
              and complete your registration.
            </p>

            <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Link expires in 24 hours</p>
                <p>Make sure to verify your email within this time.</p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> Check your spam folder if you don't see the email.
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/login" className="w-full block">
              <Button
                type="button"
                className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer"
              >
                Back to Login
              </Button>
            </Link>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={resending}
            >
              {resending ? 'Sending...' : 'Resend Email'}
            </Button>

            {resendCount > 0 && (
              <p className="text-xs text-center text-gray-600">
                Verification email resent {resendCount} time(s)
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
