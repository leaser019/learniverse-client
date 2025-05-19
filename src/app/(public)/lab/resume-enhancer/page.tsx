"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Construction, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ResumeEnhancerComingSoon() {
  const [notifyRequested, setNotifyRequested] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-background/40">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-3/4 bg-gradient-to-r from-blue-500/10 via-purple-500/15 to-pink-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
      </div>

      <div className="container pt-24 pb-20 px-4 md:px-6 mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/lab">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft size={16} />
              Back to AI Lab
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-block p-3 rounded-2xl bg-purple-100/50 backdrop-blur-sm mb-6">
            <Construction size={36} className="text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Resume Enhancer Coming Soon
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            We&apos;re building an AI-powered tool to help you create standout resumes that will
            impress recruiters and match job descriptions perfectly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="overflow-hidden bg-background/60 backdrop-blur-md border-purple-200/50 shadow-xl">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-6 py-5 border-b border-purple-200/30">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Sparkles className="text-purple-500 h-5 w-5" />
                <span>What to expect</span>
              </h2>
            </div>
            <CardContent className="p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <FeatureItem
                  title="AI-Powered Resume Analysis"
                  description="Get instant feedback on how your resume could be improved for specific job positions."
                />
                <FeatureItem
                  title="Keyword Optimization"
                  description="Automatically identify and add relevant keywords to pass ATS systems."
                />
                <FeatureItem
                  title="Content Enhancement"
                  description="Transform boring bullet points into compelling achievements that highlight your impact."
                />
                <FeatureItem
                  title="Formatting Assistance"
                  description="Get suggestions for better visual organization and professional layout."
                />
              </div>

              <div className="mt-12 text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white gap-2"
                  onClick={() => setNotifyRequested(true)}
                >
                  <Bell size={16} />
                  {notifyRequested ? "We'll notify you!" : 'Notify me when available'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-purple-100/30 p-6 shadow-sm">
      <h3 className="font-medium text-lg mb-2 text-purple-900">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}