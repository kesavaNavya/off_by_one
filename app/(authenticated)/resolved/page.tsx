'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getCasesFromStorage } from '@/lib/mock-data';
import Link from 'next/link';
import { Case } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Calendar } from 'lucide-react';

export default function ResolvedPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    if (user) {
      // Load resolved cases from mock storage
      const resolvedCases = getCasesFromStorage()
        .filter(c => c.doctor_id === user.id && c.status === 'Resolved')
        .sort((a, b) => new Date(b.resolved_at || '').getTime() - new Date(a.resolved_at || '').getTime());
      setCases(resolvedCases);
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Resolved Cases</h1>
        <p className="text-muted-foreground mt-1">View all completed screenings and diagnoses</p>
      </div>

      {cases.length === 0 ? (
        <Card className="border-border/30">
          <CardContent className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No resolved cases yet</p>
            <p className="text-sm text-muted-foreground mt-1">Complete and mark cases as resolved to see them here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cases.map((c) => (
            <Card key={c.id} className="border-border/30 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-5">
                  {/* Patient Info */}
                  <div>
                    <p className="text-xs text-muted-foreground">Patient</p>
                    <p className="font-semibold text-foreground">{c.patient_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{c.id}</p>
                  </div>

                  {/* Age & Gender */}
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-semibold text-foreground">{c.age}</p>
                    <p className="text-xs text-muted-foreground mt-1">{c.gender === 'M' ? 'Male' : 'Female'}</p>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <p className="text-xs text-muted-foreground">Diagnosis</p>
                    <Badge className={`mt-1 ${severityColor[c.prediction || 'None']}`}>
                      {c.prediction || 'Pending'}
                    </Badge>
                  </div>

                  {/* Confidence */}
                  <div>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="font-semibold text-foreground">
                      {c.confidence ? (c.confidence * 100).toFixed(1) + '%' : 'N/A'}
                    </p>
                    {c.confidence && (
                      <div className="w-full bg-border/30 rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${c.confidence * 100}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Resolved Date */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Resolved</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          {c.resolved_at ? new Date(c.resolved_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <Link href={`/cases/${c.id}`}>
                      <Button variant="outline" size="sm" className="border-border/30">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
