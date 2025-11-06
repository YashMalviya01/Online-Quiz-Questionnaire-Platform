import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Progress } from '../components/ui/Progress';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Shield,
  Code,
  Download,
  Brain,
  Sparkles
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [aiStats, setAiStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
    fetchAIStats();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai-quiz/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAiStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch AI stats:', error);
    }
  };

  const exportReport = () => {
    const csvContent = generateCSVReport(analyticsData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateCSVReport = (data) => {
    // Simple CSV generation
    let csv = 'Metric,Value\n';
    csv += `Total Users,${data?.overview?.totalUsers || 0}\n`;
    csv += `Total Quizzes,${data?.overview?.totalQuizzes || 0}\n`;
    csv += `Total Submissions,${data?.overview?.totalSubmissions || 0}\n`;
    csv += `Average Score,${data?.overview?.averageScore || 0}\n`;
    return csv;
  };

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const {
    overview = {},
    performanceTrends = [],
    userActivity = [],
    quizStats = [],
    securityAlerts = [],
    codeAnalysis = {}
  } = analyticsData;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{overview.newUsersThisWeek || 0}</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quizzes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.activeQuizzes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {overview.totalQuizzes || 0} total quizzes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.averageScore || 0}%</div>
            <Progress value={overview.averageScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {overview.securityAlerts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Questions</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {aiStats?.totalGenerated || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Generated by AI
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="code">Code Analysis</TabsTrigger>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Average scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" name="Avg Score" />
                  <Line type="monotone" dataKey="submissions" stroke="#10b981" name="Submissions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Excellent (90-100)', value: overview.scoreDistribution?.excellent || 0 },
                        { name: 'Good (70-89)', value: overview.scoreDistribution?.good || 0 },
                        { name: 'Average (50-69)', value: overview.scoreDistribution?.average || 0 },
                        { name: 'Below Average (<50)', value: overview.scoreDistribution?.poor || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Started</span>
                    <span className="text-sm text-muted-foreground">
                      {overview.completionRate?.started || 0}
                    </span>
                  </div>
                  <Progress value={100} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-sm text-muted-foreground">
                      {overview.completionRate?.completed || 0}
                    </span>
                  </div>
                  <Progress 
                    value={(overview.completionRate?.completed / overview.completionRate?.started * 100) || 0} 
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Abandoned</span>
                    <span className="text-sm text-muted-foreground">
                      {(overview.completionRate?.started - overview.completionRate?.completed) || 0}
                    </span>
                  </div>
                  <Progress 
                    value={((overview.completionRate?.started - overview.completionRate?.completed) / overview.completionRate?.started * 100) || 0}
                    className="bg-red-100"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Daily active users</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="activeUsers" fill="#3b82f6" name="Active Users" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance</CardTitle>
              <CardDescription>Top performing quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizStats.slice(0, 5).map((quiz, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{quiz.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {quiz.submissions} submissions
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">{quiz.avgScore}%</p>
                        <p className="text-xs text-muted-foreground">Avg Score</p>
                      </div>
                      <Progress value={quiz.avgScore} className="w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Recent security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p>No security alerts</p>
                  </div>
                ) : (
                  securityAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{alert.type}</p>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={alert.severity === 'high' ? 'destructive' : 'warning'}>
                        {alert.severity}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Analysis Tab */}
        <TabsContent value="code" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Plagiarism Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Analyzed</span>
                    <span className="font-bold">{codeAnalysis.totalAnalyzed || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Flagged</span>
                    <span className="font-bold text-red-600">{codeAnalysis.plagiarismFlagged || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Detection Rate</span>
                    <span className="font-bold">
                      {((codeAnalysis.plagiarismFlagged / codeAnalysis.totalAnalyzed * 100) || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>AI Generated</span>
                    <span className="font-bold text-amber-600">{codeAnalysis.aiGenerated || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Human Written</span>
                    <span className="font-bold text-green-600">{codeAnalysis.humanWritten || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Detection Rate</span>
                    <span className="font-bold">
                      {((codeAnalysis.aiGenerated / codeAnalysis.totalAnalyzed * 100) || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Features Tab */}
        <TabsContent value="ai" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  AI Quiz Generation
                </CardTitle>
                <CardDescription>Questions generated by AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Generated</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {aiStats?.totalGenerated || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Multiple Choice</span>
                    <span className="font-bold">
                      {aiStats?.byType?.['multiple-choice'] || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>True/False</span>
                    <span className="font-bold">
                      {aiStats?.byType?.['true-false'] || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Coding Questions</span>
                    <span className="font-bold">
                      {aiStats?.byType?.['code'] || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Essay Questions</span>
                    <span className="font-bold">
                      {aiStats?.byType?.['essay'] || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Difficulty Distribution
                </CardTitle>
                <CardDescription>AI-generated questions by difficulty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      Easy
                    </span>
                    <span className="font-bold">
                      {aiStats?.byDifficulty?.easy || 0}
                    </span>
                  </div>
                  <Progress 
                    value={((aiStats?.byDifficulty?.easy || 0) / (aiStats?.totalGenerated || 1) * 100)} 
                    className="h-2 bg-green-100"
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      Medium
                    </span>
                    <span className="font-bold">
                      {aiStats?.byDifficulty?.medium || 0}
                    </span>
                  </div>
                  <Progress 
                    value={((aiStats?.byDifficulty?.medium || 0) / (aiStats?.totalGenerated || 1) * 100)} 
                    className="h-2 bg-yellow-100"
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      Hard
                    </span>
                    <span className="font-bold">
                      {aiStats?.byDifficulty?.hard || 0}
                    </span>
                  </div>
                  <Progress 
                    value={((aiStats?.byDifficulty?.hard || 0) / (aiStats?.totalGenerated || 1) * 100)} 
                    className="h-2 bg-red-100"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>AI-generated question quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Quality Score</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {aiStats?.averageQuality || 0}%
                    </span>
                  </div>
                  <Progress value={aiStats?.averageQuality || 0} className="h-3" />
                  
                  <div className="flex justify-between items-center">
                    <span>Human Reviewed</span>
                    <span className="font-bold">
                      {aiStats?.humanReviewed || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending Review</span>
                    <span className="font-bold text-amber-600">
                      {(aiStats?.totalGenerated || 0) - (aiStats?.humanReviewed || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Detection Stats</CardTitle>
                <CardDescription>Code submissions analyzed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Analyzed</span>
                    <span className="text-2xl font-bold">
                      {codeAnalysis.totalAnalyzed || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AI Detected</span>
                    <Badge variant="destructive">
                      {codeAnalysis.aiGenerated || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Human Written</span>
                    <Badge variant="success">
                      {codeAnalysis.humanWritten || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Detection Accuracy</span>
                    <span className="font-bold text-green-600">
                      {aiStats?.detectionAccuracy || 'N/A'}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
