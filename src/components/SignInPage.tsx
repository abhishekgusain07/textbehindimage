import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

export function SignInPage() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    formData.set('flow', flow);

    try {
      await signIn('password', formData);
      toast.success(
        flow === 'signIn'
          ? 'Signed in successfully!'
          : 'Account created successfully!'
      );
      navigate('/dashboard');
    } catch (error: any) {
      let toastTitle = '';
      if (error.message.includes('Invalid password')) {
        toastTitle = 'Invalid password. Please try again.';
      } else {
        toastTitle =
          flow === 'signIn'
            ? 'Could not sign in, did you mean to sign up?'
            : 'Could not sign up, did you mean to sign in?';
      }
      toast.error(toastTitle);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Main Container Box */}
      <div className="w-[80vw] h-[80vh] max-w-6xl max-h-[600px] min-h-[500px] flex rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left Panel - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <img
            src="/compare-images/a.jpg"
            alt="Text Behind Image"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-sm opacity-80">
              Chosen by Parents, Loved by Kids
            </p>
            <p className="text-xs opacity-60">
              Safe, educational stories that ignite with your child's
              imagination
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-black">
                Dive Into the World of Stories
              </h1>
              <p className="text-sm text-gray-600">
                Discover fun, interactive stories that spark your child's
                imagination
              </p>
            </div>

            <div className="space-y-6">
              <Tabs
                value={flow}
                onValueChange={(value) => setFlow(value as 'signIn' | 'signUp')}
                className="w-full"
              >
                <TabsList className="hidden">
                  <TabsTrigger value="signIn">Sign In</TabsTrigger>
                  <TabsTrigger value="signUp">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signIn" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-black"
                        >
                          Email address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="amelia@gmail.com"
                          required
                          className="w-full h-12 px-4 border rounded-lg bg-white border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor="password"
                            className="text-sm font-medium text-black"
                          >
                            Password
                          </Label>
                          <a
                            href="#"
                            className="text-sm text-gray-600 hover:text-amber-600"
                          >
                            Forgot password?
                          </a>
                        </div>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Amelia@123"
                            required
                            className="w-full h-12 px-4 pr-12 border rounded-lg bg-white border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            👁
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="remember"
                          className="w-4 h-4 rounded border-gray-300 bg-white"
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-gray-600"
                        >
                          Remember me
                        </Label>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 rounded-lg font-medium bg-amber-700 hover:bg-amber-800 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? 'Signing in...' : 'Login'}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-2 bg-white text-gray-600">Or</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 flex items-center justify-center gap-2 border-gray-300 bg-white text-black hover:bg-gray-50"
                    >
                      <span className="text-lg">G</span>
                      Login with Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 flex items-center justify-center gap-2 border-gray-300 bg-white text-black hover:bg-gray-50"
                    >
                      <span className="text-lg">🍎</span>
                      Login with Apple
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setFlow('signUp')}
                      className="font-medium underline text-black hover:text-amber-600"
                    >
                      Create one
                    </button>
                  </p>
                </TabsContent>

                <TabsContent value="signUp" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="signup-email"
                          className="text-sm font-medium text-black"
                        >
                          Email address
                        </Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="amelia@gmail.com"
                          required
                          className="w-full h-12 px-4 border rounded-lg bg-white border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="signup-password"
                          className="text-sm font-medium text-black"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            required
                            className="w-full h-12 px-4 pr-12 border rounded-lg bg-white border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            👁
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="signup-remember"
                          className="w-4 h-4 rounded border-gray-300 bg-white"
                        />
                        <Label
                          htmlFor="signup-remember"
                          className="text-sm text-gray-600"
                        >
                          Remember me
                        </Label>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 rounded-lg font-medium bg-amber-700 hover:bg-amber-800 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-2 bg-white text-gray-600">Or</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 flex items-center justify-center gap-2 border-gray-300 bg-white text-black hover:bg-gray-50"
                    >
                      <span className="text-lg">G</span>
                      Login with Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 flex items-center justify-center gap-2 border-gray-300 bg-white text-black hover:bg-gray-50"
                    >
                      <span className="text-lg">🍎</span>
                      Login with Apple
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setFlow('signIn')}
                      className="font-medium underline text-gray-900 hover:text-amber-600"
                    >
                      Sign in
                    </button>
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
