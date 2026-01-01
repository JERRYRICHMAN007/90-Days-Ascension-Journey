import { useNavigate } from "react-router-dom";
import { Code, Server, Smartphone, Globe, Trophy, Flame, Coins, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

function MinimalDashboard({ currentDay, journeyProgress, userProgress }) {
  const navigate = useNavigate();

  const disciplines = [
    { id: "Frontend", label: "Frontend", icon: Code, color: "#667eea", path: "/discipline/frontend" },
    { id: "Backend", label: "Backend", icon: Server, color: "#10b981", path: "/discipline/backend" },
    { id: "Mobile", label: "Mobile", icon: Smartphone, color: "#f59e0b", path: "/discipline/mobile" },
    { id: "WordPress", label: "WordPress", icon: Globe, color: "#8b5cf6", path: "/discipline/wordpress" },
  ];

  // Calculate stats (mock data - replace with actual progress tracking)
  const stats = {
    points: journeyProgress?.totalPoints || 0,
    coins: journeyProgress?.goldCoins || 0,
    level: journeyProgress?.level || 1,
    streak: journeyProgress?.streak || 0,
  };

  const todayDisciplines = currentDay?.schedule?.disciplineRotation?.allDisciplines || [];

  return (
    <div className="minimal-dashboard space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-2xl font-bold">{stats.points}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gold Coins</p>
                <p className="text-2xl font-bold">{stats.coins}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold">{stats.level}</p>
              </div>
              <Trophy className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{stats.streak} days</p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Day {currentDay?.dayNumber || 1}</p>
              <p className="text-lg font-semibold">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          {todayDisciplines.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {todayDisciplines.map((disc, idx) => {
                const discipline = disciplines.find(d => d.id === disc);
                if (!discipline) return null;
                const Icon = discipline.icon;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${discipline.color}20`,
                      color: discipline.color,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {disc}
                  </span>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discipline Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {disciplines.map((discipline) => {
          const Icon = discipline.icon;
          return (
            <Card
              key={discipline.id}
              className="discipline-tile hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(discipline.path)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${discipline.color}20`,
                    }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{ color: discipline.color }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{discipline.label}</h3>
                    <Button
                      className="w-full"
                      style={{
                        backgroundColor: discipline.color,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(discipline.path);
                      }}
                    >
                      Start Learning
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/progress')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <div>
                <h4 className="font-semibold">Progress Overview</h4>
                <p className="text-sm text-muted-foreground">View your journey</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/achievements')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-purple-500" />
              <div>
                <h4 className="font-semibold">Achievements</h4>
                <p className="text-sm text-muted-foreground">View badges</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/reflections')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-orange-500" />
              <div>
                <h4 className="font-semibold">Reflections</h4>
                <p className="text-sm text-muted-foreground">Daily thoughts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MinimalDashboard;

