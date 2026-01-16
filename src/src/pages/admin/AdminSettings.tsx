import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Settings as SettingsIcon, User, Lock, Bell, Database } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your admin panel settings and preferences</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Profile Settings
            </CardTitle>
            <CardDescription>Manage your admin profile</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Username</p>
                <p className="text-slate-900">admin</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Role</p>
                <p className="text-slate-900">Super Administrator</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              Security
            </CardTitle>
            <CardDescription>Password and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Password</p>
                <p className="text-slate-900">••••••••••</p>
              </div>
              <p className="text-xs text-slate-600">
                Contact system administrator to change password
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Notifications
            </CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
                <span className="text-sm font-medium text-slate-700">New Lead Notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
                <span className="text-sm font-medium text-slate-700">Property Updates</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-600" />
              Data Management
            </CardTitle>
            <CardDescription>System and data settings</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Backend</p>
                <p className="text-slate-900">Internet Computer (ICP)</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Data Storage</p>
                <p className="text-slate-900">Canister-based</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card className="shadow-lg border-2 mt-6">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-zinc-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-slate-600" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-1">Version</p>
              <p className="text-lg font-bold text-slate-900">1.0.0</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-1">Framework</p>
              <p className="text-lg font-bold text-slate-900">React + Vite</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-1">Last Updated</p>
              <p className="text-lg font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
