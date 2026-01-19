import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Shield, LogOut, Home, Building2, MessageSquare, Users, Settings as SettingsIcon, ChevronDown, ChevronRight, Bug, Layout, MapPin, TrendingUp } from 'lucide-react';
import { DataService } from '../services/dataService';

// Import admin module components - verified paths
import AdminDashboard from './admin/AdminDashboard';
import CityProjects from './admin/CityProjects';
import AdminTestimonials from './admin/AdminTestimonials';
import AdminLeads from './admin/AdminLeads';
import AdminSettings from './admin/AdminSettings';
import LandingPageEditor from './admin/LandingPageEditor';
import CityPagesEditor from './admin/CityPagesEditor';
import AdminResaleListings from './admin/AdminResaleListings';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, login } = useAdminAuth();
  const [showLoginForm, setShowLoginForm] = useState(!isAuthenticated);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Navigation state
  const [activeModule, setActiveModule] = useState<'dashboard' | 'city-projects' | 'testimonials' | 'leads' | 'resale-listings' | 'landing-page' | 'city-pages' | 'settings'>('dashboard');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cityProjectsExpanded, setCityProjectsExpanded] = useState(true);
  const [showDebug, setShowDebug] = useState(true);
  const [debugInfo, setDebugInfo] = useState(DataService.getDebugInfo());

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginUsername, loginPassword);
    if (success) {
      toast.success('Login successful!');
      setShowLoginForm(false);
      setLoginUsername('');
      setLoginPassword('');
    } else {
      toast.error('Invalid username or password');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginForm(true);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    logout();
    toast.success('Logged out successfully');
    navigate({ to: '/' });
  };

  const handleModuleChange = (module: typeof activeModule, city?: string) => {
    setActiveModule(module);
    if (module === 'city-projects' && city) {
      setSelectedCity(city);
    }
    // Update debug info
    setDebugInfo(DataService.getDebugInfo());
  };

  // Login form view
  if (showLoginForm || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2">
          <CardHeader className="text-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
            <CardDescription className="text-base">Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginUsername}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-12"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg">
                <Shield className="mr-2 h-5 w-5" />
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main admin panel with sidebar
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl">
        {/* Logo/Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-slate-400">Property Scanner</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {/* Dashboard */}
            <button
              onClick={() => handleModuleChange('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeModule === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            {/* City Projects */}
            <div className="space-y-1">
              <button
                onClick={() => setCityProjectsExpanded(!cityProjectsExpanded)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeModule === 'city-projects'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium">City Projects</span>
                </div>
                {cityProjectsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              
              {cityProjectsExpanded && (
                <div className="ml-4 space-y-1 border-l-2 border-slate-700 pl-2">
                  <button
                    onClick={() => handleModuleChange('city-projects', 'gurgaon')}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                      activeModule === 'city-projects' && selectedCity === 'gurgaon'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    <span>Gurgaon</span>
                  </button>
                  <button
                    onClick={() => handleModuleChange('city-projects', 'noida')}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                      activeModule === 'city-projects' && selectedCity === 'noida'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                    <span>Noida</span>
                  </button>
                  <button
                    onClick={() => handleModuleChange('city-projects', 'dubai')}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                      activeModule === 'city-projects' && selectedCity === 'dubai'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                    <span>Dubai</span>
                  </button>
                </div>
              )}
            </div>

            {/* Testimonials */}
            <button
              onClick={() => handleModuleChange('testimonials')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeModule === 'testimonials'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Testimonials</span>
            </button>

            {/* Leads */}
            <button
              onClick={() => handleModuleChange('leads')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeModule === 'leads'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Leads</span>
            </button>

            {/* Resale Listings */}
            <button
              onClick={() => handleModuleChange('resale-listings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeModule === 'resale-listings'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Resale Properties</span>
            </button>

            {/* Landing Page Editor */}
            <button
              onClick={() => handleModuleChange('landing-page')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeModule === 'landing-page'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Layout className="h-5 w-5" />
              <span className="font-medium">Landing Page</span>
            </button>

            {/* City Pages Editor */}
            <button
              onClick={() => handleModuleChange('city-pages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeModule === 'city-pages'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span className="font-medium">City Pages</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => handleModuleChange('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeModule === 'settings'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <SettingsIcon className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Debug Panel */}
        {showDebug && (
          <div className="absolute top-4 right-4 z-50">
            <Card className="w-80 shadow-xl border-2 border-yellow-400 bg-yellow-50">
              <CardHeader className="pb-3 bg-yellow-100 border-b border-yellow-300">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Bug className="h-4 w-4 text-yellow-700" />
                    <span className="text-yellow-900">Debug Panel</span>
                  </CardTitle>
                  <button onClick={() => setShowDebug(false)} className="text-yellow-700 hover:text-yellow-900">
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-yellow-900">Active City:</span>
                  <span className="text-yellow-800">{selectedCity || 'None'}</span>
                </div>
                <div className="border-t border-yellow-200 pt-2">
                  <p className="font-semibold text-yellow-900 mb-1">Storage Type:</p>
                  <p className="text-yellow-800 text-sm">{debugInfo.storageType}</p>
                </div>
                <div className="border-t border-yellow-200 pt-2">
                  <p className="font-semibold text-yellow-900 mb-1">Data Source:</p>
                  <p className="text-[10px] text-yellow-800 break-words">{debugInfo.dataSource}</p>
                </div>
                <div className="border-t border-yellow-200 pt-2">
                  <p className="font-semibold text-yellow-900 mb-1">API Endpoint:</p>
                  <p className="text-[10px] text-yellow-800 break-words font-mono">{debugInfo.apiEndpoint}</p>
                </div>
                <div className="border-t border-yellow-200 pt-2 bg-blue-50 rounded p-2">
                  <p className="text-[10px] text-blue-800">ℹ️ {debugInfo.note}</p>
                </div>
                <button
                  onClick={() => setDebugInfo(DataService.getDebugInfo())}
                  className="w-full mt-2 px-2 py-1 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 rounded text-xs font-medium"
                >
                  Refresh Debug Info
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeModule === 'dashboard' && <AdminDashboard />}
        {activeModule === 'city-projects' && <CityProjects selectedCity={selectedCity} />}
        {activeModule === 'testimonials' && <AdminTestimonials />}
        {activeModule === 'leads' && <AdminLeads />}
        {activeModule === 'resale-listings' && <AdminResaleListings />}
        {activeModule === 'landing-page' && <LandingPageEditor />}
        {activeModule === 'city-pages' && <CityPagesEditor />}
        {activeModule === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
}
