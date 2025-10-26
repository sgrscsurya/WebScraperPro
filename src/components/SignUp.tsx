import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  CheckCircle, 
  X, 
  ArrowLeft,
  Mail,
  Lock,
  User,
  Shield,
  Zap,
  Users,
  Star,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SignUpProps {
  onSignIn: () => void;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptNewsletter: boolean;
}

interface PasswordRequirement {
  text: string;
  met: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ onSignIn, onClose }) => {
  const { signUp, isLoading } = useAuth();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptNewsletter: true
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [signUpError, setSignUpError] = useState('');

  const passwordRequirements: PasswordRequirement[] = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'One number', met: /\d/.test(formData.password) },
    { text: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) }
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);

  const validateStep1 = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!allRequirementsMet) {
      newErrors.password = 'Password does not meet requirements';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = true as any;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    try {
      await signUp(formData.email, formData.password, formData.name);
      onClose();
    } catch (error) {
      setSignUpError(error instanceof Error ? error.message : 'Sign up failed');
    }
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (signUpError) {
      setSignUpError('');
    }
  };

  const benefits = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Lightning Fast Scraping",
      description: "Extract data in seconds with our optimized engine"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure Data Handling",
      description: "Enterprise-grade security for your scraped data"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Team Collaboration",
      description: "Share scraping projects with your team"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Priority Support",
      description: "Get help when you need it with premium support"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Your Account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep} of 2
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Benefits */}
          <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Join 5,000+ Developers</h3>
              <p className="text-blue-100">Start scraping web data like a pro</p>
            </div>
            
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{benefit.title}</h4>
                    <p className="text-blue-100 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-blue-100">
                "Web Scraper Pro saved our team hundreds of hours. The easiest scraping tool we've ever used!"
              </p>
              <p className="text-xs text-blue-200 mt-2">- Sarah Chen, Data Engineer</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-3/5 p-8 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.name 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.email 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                  >
                    Continue
                  </button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.password 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                        }`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password Requirements:
                      </p>
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            {req.met ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600" />
                            )}
                            <span className={`text-sm ${req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.confirmPassword 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                      />
                      <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-sm text-red-600 dark:text-red-400">You must accept the terms and conditions</p>
                    )}

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="acceptNewsletter"
                        checked={formData.acceptNewsletter}
                        onChange={(e) => handleChange('acceptNewsletter', e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                      />
                      <label htmlFor="acceptNewsletter" className="text-sm text-gray-700 dark:text-gray-300">
                        Send me product updates, tips, and special offers
                      </label>
                    </div>
                  </div>

                  {signUpError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <p className="text-red-700 dark:text-red-400 text-sm">{signUpError}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !allRequirementsMet || !formData.acceptTerms}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </>
              )}

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <Github className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <Twitter className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <Linkedin className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;