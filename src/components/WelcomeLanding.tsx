import { useState, useRef } from 'react';
import { 
  Code2, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Shield, 
  Zap, 
  Globe, 
  BarChart3, 
  Users, 
  CheckCircle, 
  Github, 
  Star,
  X,
  Moon,
  Sun,
  LogIn
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import SignUp from './SignUp';
import SignIn from './SignIn';
import ForgotPassword from './ForgotPassword';

interface WelcomeLandingProps {
  onGetStarted: () => void;
}

function WelcomeLanding({ onGetStarted }: WelcomeLandingProps) {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Extract data in seconds with our optimized scraping engine"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Reliable",
      description: "Your data is safe with enterprise-grade security"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Universal Compatibility",
      description: "Works with virtually any website structure"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Multiple Formats",
      description: "Extract HTML, text, links, headings, and more"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User-Friendly",
      description: "No technical skills required - anyone can use it"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered",
      description: "Smart detection for optimal data extraction"
    }
  ];

  const useCases = [
    {
      category: "Business Intelligence",
      examples: ["Competitor analysis", "Market research", "Price monitoring"]
    },
    {
      category: "Content Creation",
      examples: ["Content research", "Trend analysis", "Inspiration gathering"]
    },
    {
      category: "Academic Research",
      examples: ["Data collection", "Literature review", "Source aggregation"]
    },
    {
      category: "Development",
      examples: ["API testing", "Data migration", "Content integration"]
    }
  ];

  const stats = [
    { value: "10,000+", label: "Websites Scraped" },
    { value: "99.9%", label: "Success Rate" },
    { value: "< 3s", label: "Average Response" },
    { value: "24/7", label: "Availability" }
  ];

  const handleVideoEnd = () => {
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

    const handleSignIn = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleSignUp = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setShowSignIn(false);
  };

  const handleCloseAuth = () => {
    setShowSignUp(false);
    setShowSignIn(false);
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 overflow-hidden">
      {/* Auth Modals */}
      {showSignUp && (
        <SignUp onSignIn={handleSignIn} onClose={handleCloseAuth} />
      )}
      {showSignIn && (
        <SignIn 
          onSignUp={handleSignUp} 
          onClose={handleCloseAuth}
          onForgotPassword={handleForgotPassword}
        />
      )}
      {showForgotPassword && (
        <ForgotPassword 
          onSignIn={handleSignIn}
          onClose={handleCloseAuth}
        />
      )}
      
      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Web Scraper Pro Demo
              </h3>
              <button
                onClick={handleCloseVideo}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Video Player */}
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-auto max-h-[70vh]"
                controls
                autoPlay
                onEnded={handleVideoEnd}
              >
                <source src="/sample_demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Controls Info */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Video will auto-close when finished</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Use player controls for playback</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200 dark:bg-green-900 rounded-full blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Web Scraper Pro</span>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  Welcome, {user?.name}!
                </span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-24 pt-12">
          <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
            <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Trusted by 5,000+ developers worldwide
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Extract Web Data
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Like Never Before
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            The most powerful, intuitive web scraping tool that turns complex websites into structured data with just one click.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onGetStarted}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-3 text-lg font-semibold"
            >
              <span>Start Scraping Now</span>
              <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </button>
            
            <button 
              onClick={() => setShowVideo(true)}
              className="group px-8 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 text-lg font-semibold"
            >
              <Play className="h-5 w-5 text-blue-600" />
              <span>Watch Demo</span>
            </button>

          {!isAuthenticated && (
              <button 
                onClick={handleSignUp}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 text-lg font-semibold"
              >
                <span>Sign Up Free</span>
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Web Scraper Pro?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with cutting-edge technology to deliver the best scraping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-blue-600 dark:text-blue-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Perfect For Every Use Case
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Whether you're a developer, researcher, or business professional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {useCase.category}
                </h3>
                <ul className="space-y-3">
                  {useCase.examples.map((example, exampleIndex) => (
                    <li key={exampleIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Transform Web Data?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of users who are already extracting valuable insights with Web Scraper Pro
              </p>
              <button
                onClick={onGetStarted}
                className="px-12 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 text-lg font-semibold"
              >
                Start Free Now
              </button>
              <p className="text-sm opacity-75 mt-4">
                No credit card required • Free forever for basic usage
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800 pt-8">
          <p>© 2025 Web Scraper Pro. Built with React, Tailwind CSS, and Supabase.</p>
          <p className="mt-1">Use responsibly and respect website terms of service.</p>
        </footer>
      </div>
    </div>
  );
}

export default WelcomeLanding;