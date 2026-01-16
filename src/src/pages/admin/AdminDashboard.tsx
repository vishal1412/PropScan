import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useGetLeads, useGetTestimonials, useGetCities } from '../../hooks/useQueries';
import { Building2, MessageSquare, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { data: leads } = useGetLeads();
  const { data: testimonials } = useGetTestimonials();
  const { data: cities } = useGetCities();

  const stats = [
    {
      title: 'Total Leads',
      value: (leads as any[] || []).length,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Cities',
      value: (cities as any[] || []).length,
      icon: Building2,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Testimonials',
      value: (testimonials as any[] || []).length,
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Active Projects',
      value: 0,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome to the admin panel. Here's an overview of your system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-2 shadow-lg hover:shadow-xl transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {(leads as any[] || []).length === 0 ? (
              <p className="text-slate-500 text-center py-4">No leads yet</p>
            ) : (
              <div className="space-y-3">
                {(leads as any[] || []).slice(0, 5).map((lead: any) => (
                  <div key={lead.id?.toString()} className="p-3 bg-slate-50 rounded-lg border">
                    <p className="font-medium text-slate-900">{lead.fullName}</p>
                    <p className="text-sm text-slate-600">{lead.cityInterested}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Recent Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {(testimonials as any[] || []).length === 0 ? (
              <p className="text-slate-500 text-center py-4">No testimonials yet</p>
            ) : (
              <div className="space-y-3">
                {(testimonials as any[] || []).slice(0, 5).map((testimonial: any) => (
                  <div key={testimonial.id?.toString()} className="p-3 bg-slate-50 rounded-lg border">
                    <p className="font-medium text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600 line-clamp-2">{testimonial.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
