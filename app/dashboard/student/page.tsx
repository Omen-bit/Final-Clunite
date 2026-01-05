'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getUserFromDatabase } from '@/lib/sync-user';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Calendar,
  Award,
  Users,
  QrCode,
  Clock,
  MapPin,
  Star,
  Target,
  Sparkles,
  Loader2,
  MessageCircle,
  Share2,
  Heart,
} from 'lucide-react';

const achievements = [
  {
    title: 'Registered Events',
    value: '12',
    change: '+3 this month',
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Certificates Earned',
    value: '8',
    change: '+2 this semester',
    icon: Award,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Events Attended',
    value: '15',
    change: '+5 this month',
    icon: Users,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    title: 'QR Scans',
    value: '23',
    change: '+8 recent',
    icon: QrCode,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
];

const recommendedEvents = [
  {
    id: 1,
    title: 'AI & Machine Learning Workshop',
    club: 'Tech Club',
    date: 'Dec 15, 2024',
    time: '2:00 PM',
    venue: 'Auditorium A',
    rating: 4.8,
    attendees: ['A', 'B', 'C', 'D'],
  },
  {
    id: 2,
    title: 'Cultural Fest 2024',
    club: 'Cultural Committee',
    date: 'Dec 20, 2024',
    time: '6:00 PM',
    venue: 'Main Ground',
    rating: 4.9,
    attendees: ['E', 'F', 'G'],
  },
];

export default function StudentDashboard() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      router.push('/login');
      return;
    }

    getUserFromDatabase(authUser.id)
      .then(setUserData)
      .finally(() => setLoading(false));
  }, [authUser, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const user = {
    name: userData?.full_name || 'Student',
    college: userData?.college || 'Your College',
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-8 py-6 space-y-10">
      {/* HERO */}
      <div className="relative rounded-2xl bg-gradient-to-br from-blue-100 via-blue-50 to-white border border-black/5 p-10 overflow-hidden">
        <div className="max-w-xl">
          <p className="text-sm text-muted-foreground">Dashboard Overview</p>

          <h1 className="text-4xl font-semibold tracking-tight mt-1">
            Hello {user.name}
          </h1>

          <p className="text-sm text-muted-foreground mt-2">
            Stay updated, join events & connect with your community.
          </p>

          <div className="mt-4 space-y-2">
            <Badge className="bg-blue-100 text-blue-700">
              <Sparkles className="h-3 w-3 mr-1" />5 recommendations
            </Badge>

            <Badge className="bg-indigo-100 text-indigo-700">
              <Target className="h-3 w-3 mr-1" />2 events this week
            </Badge>
          </div>
        </div>

        <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-72">
          <img
            src="/user_greet.png"
            alt="Dashboard illustration"
            className="w-full h-full  rounded-r-2xl"
          />
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="rounded-2xl bg-white border border-black/5 p-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl border border-black/5 p-6 space-y-4 ${item.bg}`}
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-md bg-white flex items-center justify-center">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">
                  Achievement
                </span>
              </div>

              <div>
                <p className="text-3xl font-semibold tracking-tight">
                  {item.value}
                </p>
                <p className="text-sm text-muted-foreground">{item.title}</p>
              </div>

              <p className="text-xs text-muted-foreground">{item.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN + SIDE */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* MAIN — Social feed, cleaner & modern */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              What’s happening in your clubs
            </h2>

            <Badge className="bg-blue-100 text-blue-700">Live updates</Badge>
          </div>

          {recommendedEvents.map((event) => (
            <div
              key={event.id}
              className="
        rounded-xl
        border border-black/10
        bg-white
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-0.5
        transition
        overflow-hidden
      "
            >
              {/* CARD HEADER */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-indigo-200 flex items-center justify-center font-semibold">
                    {event.club[0]}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{event.club}</p>
                    <p className="text-xs text-muted-foreground">
                      posted an event
                    </p>
                  </div>
                </div>

                <Badge className="bg-purple-100 text-purple-700">
                  ⭐ {event.rating}
                </Badge>
              </div>

              {/* EVENT IMAGE */}
              <div className="h-44 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
                  className="w-full h-full object-cover"
                  alt="event"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-lg">{event.title}</h3>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.venue}
                  </span>
                </div>

                {/* TAGS */}
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-orange-100 text-orange-700">
                    🔥 Popular
                  </Badge>

                  <Badge className="bg-emerald-100 text-emerald-700">
                    🎯 Limited seats
                  </Badge>
                </div>

                {/* PEOPLE INTERESTED */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex -space-x-2">
                    {event.attendees.map((a, i) => (
                      <div
                        key={i}
                        className="h-7 w-7 rounded-full bg-indigo-200 border border-white flex items-center justify-center text-xs font-medium"
                      >
                        {a}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(Math.random() * 10) + 5} students interested
                  </p>
                </div>

                {/* ACTION BAR */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-red-500">
                      <Heart className="h-4 w-4" /> Like
                    </button>

                    <button className="flex items-center gap-1 hover:text-gray-900">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                  </div>

                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Register
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SIDE */}
        <div className="space-y-6">
          {/* Quick actions */}
          <Card className="rounded-2xl overflow-hidden border border-black/10 bg-white">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 mt-2">
              <Button className="w-full justify-start rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                <QrCode className="h-4 w-4 mr-2" />
                Scan event QR
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start rounded-lg"
              >
                <Award className="h-4 w-4 mr-2 text-emerald-600" />
                Certificates
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start rounded-lg"
              >
                <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                My events
              </Button>
            </CardContent>
          </Card>

          {/* Invite */}
          <Card className="rounded-2xl overflow-hidden border border-blue-200 bg-blue-50">
            <CardContent className="p-6 space-y-2">
              <p className="font-medium">Invite friends</p>
              <p className="text-sm text-muted-foreground">
                Grow the club — share access.
              </p>
              <Button
                size="sm"
                className="rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Share invite
              </Button>
            </CardContent>
          </Card>

          {/* Achievement */}
          <Card className="rounded-2xl overflow-hidden border border-emerald-200 bg-emerald-50">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-700" />
                <p className="font-medium">Achievement unlocked</p>
              </div>
              <p className="text-sm text-muted-foreground">
                You’ve attended 15 events this semester.
              </p>
              <Button size="sm" variant="outline" className="rounded-lg">
                View progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
