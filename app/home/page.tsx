'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye, Zap, Shield, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Eye className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold text-foreground">DR Screening</span>
            </div>
            <Link href="/login">
              <Button className="gap-2">
                Login
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full border border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            <span className="text-sm font-medium">AI-Powered Screening</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Detect Diabetic Retinopathy
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Early & Accurately
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered retinal image analysis for early detection and monitoring of diabetic retinopathy. 
            Empower healthcare professionals with precise, reliable screening results in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/login">
              <Button size="lg" className="gap-2 group">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 rounded-xl border border-border bg-gradient-to-b from-card to-card/50 p-8 sm:p-12">
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
            <Eye className="w-16 h-16 text-primary/30" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose DR Screening?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Industry-leading accuracy and speed for diabetic retinopathy detection
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="group rounded-xl border border-border bg-card p-8 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Real-Time Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get instant AI-powered analysis results in seconds, not days
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-xl border border-border bg-card p-8 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Clinical Accuracy</h3>
            <p className="text-sm text-muted-foreground">
              Validated AI model with high sensitivity and specificity
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-xl border border-border bg-card p-8 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Comprehensive Reports</h3>
            <p className="text-sm text-muted-foreground">
              Detailed analysis reports for clinical decision-making
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group rounded-xl border border-border bg-card p-8 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">HIPAA Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Secure, privacy-focused platform for healthcare data
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">98%</div>
            <p className="text-muted-foreground">Detection Accuracy</p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">&lt;2s</div>
            <p className="text-muted-foreground">Analysis Time</p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">10k+</div>
            <p className="text-muted-foreground">Screens Completed</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 p-12 sm:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join healthcare professionals using DR Screening for accurate diabetic retinopathy detection
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Access Platform
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 DR Screening Platform. All rights reserved.</p>
            <p className="mt-2">Clinical Tool for Professional Use Only</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
