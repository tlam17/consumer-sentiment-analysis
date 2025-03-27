import { ChartLine, Brain, BarChart, LineChart, Github, Linkedin } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Home() {
    return (
        <>
        <header className="w-full border-b border-border bg-background px-6 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
            
            {/* Logo / Brand */}
            <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <ChartLine className="w-8 h-8 text-primary" />
                InsightBoard
            </h1>

            {/* Nav Actions */}
            <div className="flex items-center gap-4">
                <a
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                Log In
                </a>
                <a
                href="/signup"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-colors"
                >
                Sign Up
                </a>
            </div>
            </div>
        </header>

        {/* Hero */}
        <section className="hero-gradient text-foreground py-24 px-6">
            <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Consumer Sentiment Analysis Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unlock valuable insights from customer reviews with advanced sentiment analysis and data visualization tools.
            </p>
            </div>
        </section>

        {/* Feature Section */}
        <section className="bg-background text-foreground px-6 py-20">
        <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-col items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-md">
                  <BarChart className="w-6 h-6" />
                </div>
                <CardTitle className="text-primary text-xl font-semibold">Advanced NLP Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground">
                    Sophisticated text preprocessing and natural language processing to determine sentiment polarity with high accuracy.
                </p>
                </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-col items-start gap-4">
                <div className="bg-secondary/10 text-secondary p-3 rounded-md">
                  <Brain className="w-6 h-6" />
                </div>
                <CardTitle className="text-secondary text-xl font-semibold">Keyword Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground">
                    Extract and analyze key terms, phrases, and patterns from customer reviews to identify critical feedback themes.
                </p>
                </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-col items-start gap-4">
                <div className="bg-accent/10 text-accent p-3 rounded-md">
                  <LineChart className="w-6 h-6" />
                </div>
                <CardTitle className="text-accent text-xl font-semibold">Trend Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground">
                    Track sentiment trends across time periods and product categories with interactive data visualizations.
                </p>
                </CardContent>
            </Card>
            </div>
        </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/50 text-foreground px-6 py-20">
        <div className="mx-auto max-w-4xl">
            <Card className="bg-card border border-border shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Text */}
                <div>
                <h3 className="text-2xl font-semibold mb-2">Start Analyzing Today</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    Get started with our powerful sentiment analysis tools and gain valuable insights from your customer reviews.
                </p>
                </div>

                {/* CTA Button */}
                <a
                href="/signup"
                className="shrink-0 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-colors"
                >
                Get Started
                </a>
            </div>
            </Card>
        </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-border bg-background px-6 py-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            {/* Left: Branding or copyright */}
            <p>&copy; {new Date().getFullYear()} InsightBoard. All rights reserved.</p>

            {/* Right: Links */}
            <div className="flex items-center gap-6">
            <a
                href="https://github.com/tlam17/consumer-sentiment-analysis"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                </div>
            </a>
            <a
                href="https://www.linkedin.com/in/tyler-lam-001158244/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    Tyler's LinkedIn
                </div>
            </a>
            <a
                href="https://www.linkedin.com/in/dain0829/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    Dain's LinkedIn
                </div>
            </a>
            </div>
        </div>
        </footer>

        </>
    )
}