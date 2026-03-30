import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  TrendingUp, 
  UtensilsCrossed, 
  Target, 
  Dumbbell, 
  BarChart3, 
  Moon, 
  Sun,
  CheckCircle,
  ArrowRight,
  Flame,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: UtensilsCrossed,
    title: 'Food Tracking',
    description: 'Log your meals and track calories in real-time.',
    color: 'border-l-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-500'
  },
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Set personalized daily goals tailored to you.',
    color: 'border-l-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-500'
  },
  {
    icon: Dumbbell,
    title: 'Workout Logging',
    description: 'Track exercises and calories burned.',
    color: 'border-l-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Visualize progress with detailed charts.',
    color: 'border-l-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-500'
  },
  {
    icon: TrendingUp,
    title: 'Streak System',
    description: 'Stay motivated with gamification.',
    color: 'border-l-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-500'
  },
  {
    icon: Zap,
    title: 'Indian Foods',
    description: '300+ Indian dishes with accurate nutrition data.',
    color: 'border-l-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-500'
  }
];

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a]">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">FitTrack Pro</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/signup" className="btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Track Your Fitness
                  <span className="text-primary"> Journey</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Log calories, monitor macros, track workouts, and achieve your health goals with our comprehensive tracking platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup" className="btn-primary px-8 py-3 text-base">
                    Start Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/login" className="btn-secondary px-8 py-3 text-base">
                    Sign In
                  </Link>
                </div>
              </div>
              
              {/* Preview Card */}
              <div className="card p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-4 rounded-xl border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Calories</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">1,842</p>
                    <p className="text-xs text-gray-400">of 2,000 goal</p>
                  </div>
                  <div className="p-4 rounded-xl border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Protein</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">98g</p>
                    <p className="text-xs text-gray-400">of 150g goal</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/20 mb-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Carbs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">215g</p>
                  <p className="text-xs text-gray-400">of 250g goal</p>
                </div>
                <div className="p-4 rounded-xl border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Progress</span>
                    <span className="text-sm font-semibold text-emerald-600">92%</span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-dark-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              A complete fitness tracking solution with all the tools you need to reach your goals.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`card p-5 border-l-4 ${feature.color}`}
                >
                  <div className={`w-10 h-10 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3`}>
                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="card p-10 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Start?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                Join thousands of users tracking their fitness journey with FitTrack Pro.
              </p>
              <Link to="/signup" className="btn-primary px-8 py-3 text-base inline-flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; 2026 FitTrack Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
