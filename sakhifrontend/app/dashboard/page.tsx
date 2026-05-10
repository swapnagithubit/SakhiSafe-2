"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, MapPin, Bell, Shield, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SOSButton } from "@/components/sos-button";
import { useAuth } from "@/lib/auth-context";

const quickActions = [
  {
    title: "Emergency Contacts",
    description: "Manage your trusted contacts for SOS alerts",
    icon: Users,
    href: "/contacts",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Crime Zones",
    description: "View safety data for cities across India",
    icon: MapPin,
    href: "/crime-zones",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user.name}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your safety dashboard - access emergency features and stay informed
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* SOS Section */}
        <Card className="relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/5 via-red-500/10 to-transparent">
          {/* Alert stripe pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-5">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, #ef4444 10px, #ef4444 20px)",
              }}
            />
          </div>

          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                <Bell className="h-6 w-6 text-red-500" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                </span>
              </div>
              <div>
                <CardTitle className="text-xl text-red-600 dark:text-red-400">
                  Emergency SOS
                </CardTitle>
                <CardDescription>
                  Press the button to instantly alert all your emergency contacts
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex justify-center pb-10 pt-6">
            <SOSButton />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="grid gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.title}
                className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
              >
                <Link href={action.href}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${action.bg}`}
                    >
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Safety Tips Card */}
          <Card className="mt-6 bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Safety Tip</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Make sure to add at least 3 emergency contacts so your SOS alerts
                    reach multiple trusted people. Keep your location services enabled
                    for accurate emergency response.
                  </p>
                  <Button variant="link" asChild className="mt-2 h-auto p-0">
                    <Link href="/contacts">
                      Manage contacts
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
