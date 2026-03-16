'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Case, CaseStatus, DRSeverity } from '@/lib/types';
import { getCasesFromStorage, getDashboardStats } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, TrendingUp } from 'lucide-react';

const severityColors: Record<DRSeverity | string, string> = {
  None: 'bg-green-100 text-green-800 border-green-300',
  Mild: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Moderate: 'bg-orange-100 text-orange-800 border-orange-300',
  Severe: 'bg-red-100 text-red-800 border-red-300',
  Proliferative: 'bg-red-200 text-red-900 border-red-400',
};

const statusColors: Record<CaseStatus, string> = {
  'Pending': 'bg-slate-100 text-slate-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Resolved': 'bg-green-100 text-green-800',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Load mock cases from localStorage
    if (user) {
      const allCases = getCasesFromStorage().filter(c => c.doctor_id === user.id);
      setCases(allCases);
    }
  }, [user]);

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && c.status === activeTab;
  });

  const stats = {
    total: cases.length,
    pending: cases.filter((c) => c.status === 'Pending').length,
    inProgress: cases.filter((c) => c.status === 'In Progress').length,
    resolved: cases.filter((c) => c.status === 'Resolved').length,
    highRisk: cases.filter((c) => ['Severe', 'Proliferative'].includes(c.prediction || '')).length,
  };

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all screening cases</p>
        </div>
        <Link href="/screening">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Screening
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Cases" value={stats.total} icon="📊" />
        <StatCard label="Pending" value={stats.pending} icon="⏳" color="text-yellow-600" />
        <StatCard label="In Progress" value={stats.inProgress} icon="🔄" color="text-blue-600" />
        <StatCard label="Resolved" value={stats.resolved} icon="✅" color="text-green-600" />
        <StatCard label="High Risk" value={stats.highRisk} icon="⚠️" color="text-red-600" />
      </div>

      {/* Cases Table */}
      <Card className="border-border/30">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Screening Cases</CardTitle>
              <CardDescription>All cases from your clinic</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border/30"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="Pending">Pending ({stats.pending})</TabsTrigger>
                  <TabsTrigger value="In Progress">In Progress ({stats.inProgress})</TabsTrigger>
                  <TabsTrigger value="Resolved">Resolved ({stats.resolved})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  {filteredCases.length === 0 ? (
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">No cases found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/30">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Age</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Diagnosis</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Confidence</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCases.map((c) => (
                            <tr key={c.id} className="border-b border-border/20 hover:bg-accent/5 transition-colors">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-foreground">{c.patient_name}</p>
                                  <p className="text-xs text-muted-foreground">{c.id}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-foreground">{c.age}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className={statusColors[c.status]}>
                                  {c.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                {c.prediction ? (
                                  <Badge className={severityColors[c.prediction as SeverityLevel]}>
                                    {c.prediction}
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground text-xs">Pending</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-foreground">
                                {c.confidence ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-border/30 rounded-full h-2">
                                      <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: `${c.confidence * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-xs">{(c.confidence * 100).toFixed(0)}%</span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-xs">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Link href={`/cases/${c.id}`}>
                                  <Button variant="ghost" size="sm" className="h-8 px-3">
                                    View
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color?: string }) {
  return (
    <Card className="border-border/30 bg-card/50">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{label}</p>
            <p className={`text-2xl font-bold mt-2 ${color || 'text-foreground'}`}>{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}
