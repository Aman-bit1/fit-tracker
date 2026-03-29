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
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: UtensilsCrossed,
    title: 'Food Tracking',
    description: 'Log your meals effortlessly and track calories and macros in real-time.'
  },
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Set personalized daily calorie and macro goals tailored to your needs.'
  },
  {
    icon: Dumbbell,
    title: 'Workout Logging',
    description: 'Track your exercises and estimate calories burned for each session.'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Visualize your progress with detailed charts and weekly insights.'
  },
  {
    icon: TrendingUp,
    title: 'Streak System',
    description: 'Stay motivated with gamification and track your consistency.'
  }
];

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border-b dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">FitTrack Pro</span>
            </div>
            <div className="flex items-center gap-4">
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
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
                Your Personal{' '}
                <span className="text-primary">Fitness</span>{' '}
                Companion
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
                Track calories, monitor macros, log workouts, and achieve your fitness goals 
                with our comprehensive tracking platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                <Link to="/signup" className="btn-primary px-8 py-3 text-lg">
                  Start Free Trial
                </Link>
                <Link to="/login" className="btn-secondary px-8 py-3 text-lg">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Everything You Need to Succeed
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="card-hover text-center animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary/5 dark:bg-primary/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Transform Your Fitness Journey?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of users who have already achieved their fitness goals with FitTrack Pro.
            </p>
            <Link to="/signup" className="btn-primary px-8 py-3 text-lg inline-block">
              Get Started Today
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-white dark:bg-dark-card border-t dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; 2024 FitTrack Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
