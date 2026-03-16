'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getCasesFromStorage } from '@/lib/mock-data';
import Link from 'next/link';
import { Case } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    if (user) {
      // Load cases with predictions from mock storage
      const allCases = getCasesFromStorage().filter(
        c => c.doctor_id === user.id && c.prediction
      );
      setCases(allCases);
    }
  }, [user]);

  const severityColor: Record<string, string> = {
    None: 'bg-green-100 text-green-800 border-green-300',
    Mild: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Moderate: 'bg-orange-100 text-orange-800 border-orange-300',
    Severe: 'bg-red-100 text-red-800 border-red-300',
    Proliferative: 'bg-red-200 text-red-900 border-red-400',
  };

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports & Results</h1>
        <p className="text-muted-foreground mt-1">View and download screening reports</p>
      </div>

      {cases.length === 0 ? (
        <Card className="border-border/30">
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No reports available yet</p>
            <p className="text-sm text-muted-foreground mt-1">Complete screenings to generate reports</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <Card key={c.id} className="border-border/30 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{c.patient_name}</CardTitle>
                    <CardDescription className="truncate">{c.id}</CardDescription>
                  </div>
                  <Badge className={severityColor[c.prediction || 'None']}>
                    {c.prediction}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-semibold text-foreground">
                      {(c.confidence! * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-border/30 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${c.confidence! * 100}%` }}
                    />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Analyzed: {new Date(c.created_at).toLocaleDateString()}
                </div>

                <Link href={`/cases/${c.id}`}>
                  <Button variant="outline" className="w-full gap-2 border-border/30">
                    <FileText className="w-4 h-4" />
                    View Report
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
