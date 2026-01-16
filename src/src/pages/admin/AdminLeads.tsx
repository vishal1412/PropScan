import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Download, Users, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { DataService } from '../../services/dataService';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  budget?: string;
  purpose?: string;
  message?: string;
  timestamp: string;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [cityFilter, setCityFilter] = useState<string>('all');

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    if (cityFilter === 'all') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter(lead => lead.city.toLowerCase() === cityFilter.toLowerCase()));
    }
  }, [leads, cityFilter]);

  const loadLeads = async () => {
    const data = await DataService.loadLeads();
    setLeads(data);
  };

  const downloadCSV = () => {
    if (filteredLeads.length === 0) {
      toast.error('No leads to download');
      return;
    }

    // Create CSV content
    const headers = ['Name', 'Phone', 'Email', 'City', 'Budget', 'Purpose', 'Message', 'Date'];
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.phone,
      lead.email,
      lead.city,
      lead.budget || 'N/A',
      lead.purpose || 'N/A',
      lead.message || 'N/A',
      new Date(lead.timestamp).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${cityFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV downloaded successfully');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Lead Management</h1>
        <p className="text-slate-600 mt-1">View and export customer leads</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Leads</p>
                <p className="text-3xl font-bold text-slate-900">{leads.length}</p>
              </div>
              <Users className="h-10 w-10 text-blue-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Gurgaon</p>
                <p className="text-3xl font-bold text-slate-900">
                  {leads.filter(l => l.city.toLowerCase() === 'gurgaon').length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                G
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Noida</p>
                <p className="text-3xl font-bold text-slate-900">
                  {leads.filter(l => l.city.toLowerCase() === 'noida').length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                N
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Dubai</p>
                <p className="text-3xl font-bold text-slate-900">
                  {leads.filter(l => l.city.toLowerCase() === 'dubai').length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-lg">
                D
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS AND ACTIONS */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Filter className="h-5 w-5 text-slate-600" />
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="gurgaon">Gurgaon</SelectItem>
                  <SelectItem value="noida">Noida</SelectItem>
                  <SelectItem value="dubai">Dubai</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-slate-600">
                Showing {filteredLeads.length} of {leads.length} leads
              </span>
            </div>
            <Button onClick={downloadCSV} size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* LEADS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No leads found</p>
              <p className="text-sm">Leads captured from the website will appear here</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Phone</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">City</TableHead>
                      <TableHead className="font-semibold">Budget</TableHead>
                      <TableHead className="font-semibold">Purpose</TableHead>
                      <TableHead className="font-semibold">Message</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                          <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                            {lead.phone}
                          </a>
                        </TableCell>
                        <TableCell>
                          <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline text-sm">
                            {lead.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {lead.city}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{lead.budget || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-slate-600">{lead.purpose || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-slate-600 line-clamp-2">{lead.message || 'N/A'}</p>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {new Date(lead.timestamp).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
