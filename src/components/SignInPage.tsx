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
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export function SignInPage() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false,
    });
  const navigate = useNavigate();

  const validatePassword = (password: string): PasswordValidation => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (flow === 'signUp') {
      setPasswordValidation(validatePassword(value));
    }
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(Boolean);
  };

  const doPasswordsMatch = () => {
    return password === confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate signup requirements
    if (flow === 'signUp') {
      if (!isPasswordValid()) {
        toast.error('Please meet all password requirements');
        setSubmitting(false);
        return;
      }
      if (!doPasswordsMatch()) {
        toast.error('Passwords do not match');
        setSubmitting(false);
        return;
      }
    }

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

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google');
      toast.success('Signed in with Google successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="h-[80vh] flex items-center justify-center p-4 bg-gray-50">
      {/* Main Container Box */}
      <div className="w-[80vw] h-[85vh] max-w-6xl max-h-[700px] min-h-[600px] flex rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left Panel - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <img
            src="/compare-images/g.png"
            alt="Text Behind Image"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-sm opacity-80">
              Professional Text Effects
            </p>
            <p className="text-xs opacity-60">
              Create stunning visuals with text that seamlessly blends behind your images
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white overflow-y-scroll">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-black">
                Create Stunning Text Behind Images
              </h1>
              <p className="text-sm text-gray-600">
                Transform your photos with beautiful text effects that appear behind your subjects
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
                      className="w-full h-12 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 bg-white text-black hover:bg-gray-50"
                  >
                    <img src="/google.png" alt="Google" className="w-5 h-5" />
                    Continue with Google
                  </Button>
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
                            value={password}
                            onChange={(e) =>
                              handlePasswordChange(e.target.value)
                            }
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

                        {/* Password Validation Indicators */}
                        <AnimatePresence>
                          {password && !isPasswordValid() && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-3 space-y-1"
                            >
                              <div className="text-xs space-y-1">
                                {!passwordValidation.minLength && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center gap-2 text-red-500"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>At least 8 characters</span>
                                  </motion.div>
                                )}
                                {!passwordValidation.hasUppercase && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center gap-2 text-red-500"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>One uppercase letter</span>
                                  </motion.div>
                                )}
                                {!passwordValidation.hasLowercase && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center gap-2 text-red-500"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>One lowercase letter</span>
                                  </motion.div>
                                )}
                                {!passwordValidation.hasNumber && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center gap-2 text-red-500"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>One number</span>
                                  </motion.div>
                                )}
                                {!passwordValidation.hasSpecialChar && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center gap-2 text-red-500"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>One special character</span>
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirm-password"
                          className="text-sm font-medium text-black"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
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

                        {/* Password Match Indicator */}
                        <AnimatePresence>
                          {confirmPassword && !doPasswordsMatch() && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-xs flex items-center gap-2 mt-2 text-red-500"
                            >
                              <X className="w-3 h-3" />
                              <span>Passwords do not match</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
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
                      className="w-full h-12 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 bg-white text-black hover:bg-gray-50"
                  >
                    <img src="/google.png" alt="Google" className="w-5 h-5" />
                    Continue with Google
                  </Button>

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
