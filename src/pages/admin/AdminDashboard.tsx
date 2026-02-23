"use client";

import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Eye,
  MessageSquare,
  ThumbsUp,
  ClipboardList,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  stats: {
    totalUsers: number;
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalViews: number;
    totalReactions: number;
    totalComments: number;
  };
  recentBlogs: any[];
  recentUsers: any[];
  reports: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token]);

  const fetchDashboard = async () => {
    try {
      const result = await apiClient(API_ENDPOINTS.adminDashboard, {
        token: token || undefined,
      });
      if (!result.success) {
        throw new Error("Failed to fetch dashboard");
      }

      setData(result.data);
    } catch (error) {
      console.error("Error fetching dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-6 text-center">No data found</div>;
  }

  const reportChartData = Object.values(
    (data.reports || []).reduce((acc: any, report: any) => {
      const date = new Date(report.createdAt).toISOString().split("T")[0];

      if (!acc[date]) {
        acc[date] = { date, count: 0 };
      }

      acc[date].count += 1;

      return acc;
    }, {}),
  ).sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ================= Navbar Space ================= */}
      <div className="flex-1">
        <div className="max-w-[1700px] mx-auto px-6 py-8 space-y-10">
          {/* ================= Stats Section ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={data.stats.totalUsers}
              icon={<Users className="w-6 h-6 text-blue-600" />}
              color="bg-blue-100"
            />

            <StatCard
              title="Total Blogs"
              value={data.stats.totalBlogs}
              icon={<FileText className="w-6 h-6 text-purple-600" />}
              color="bg-purple-100"
            />

            <StatCard
              title="Published Blogs"
              value={data.stats.publishedBlogs}
              icon={<ClipboardList className="w-6 h-6 text-green-600" />}
              color="bg-green-100"
            />

            <StatCard
              title="Draft Blogs"
              value={data.stats.draftBlogs}
              icon={<ClipboardList className="w-6 h-6 text-yellow-600" />}
              color="bg-yellow-100"
            />

            <StatCard
              title="Total Views"
              value={data.stats.totalViews}
              icon={<Eye className="w-6 h-6 text-indigo-600" />}
              color="bg-indigo-100"
            />

            <StatCard
              title="Total Reactions"
              value={data.stats.totalReactions}
              icon={<ThumbsUp className="w-6 h-6 text-pink-600" />}
              color="bg-pink-100"
            />

            <StatCard
              title="Total Comments"
              value={data.stats.totalComments}
              icon={<MessageSquare className="w-6 h-6 text-orange-600" />}
              color="bg-orange-100"
            />
          </div>

          {/* ================= Recent Section ================= */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* ================= Recent Blogs ================= */}
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Recent Blogs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.recentBlogs.length === 0 ? (
                  <p className="text-gray-500">No recent blogs</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-gray-600 text-left">
                          <th className="py-3">Title</th>
                          <th>Author</th>
                          <th>Status</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentBlogs.map((blog) => (
                          <tr
                            key={blog._id}
                            className="border-b hover:bg-gray-50 transition"
                          >
                            <td className="py-3 font-medium text-gray-800">
                              {blog.title}
                            </td>
                            <td>{blog.authorId?.name}</td>
                            <td>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  blog.status === "published"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {blog.status}
                              </span>
                            </td>
                            <td>
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ================= Recent Users ================= */}
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.recentUsers.length === 0 ? (
                  <p className="text-gray-500">No recent users</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-gray-600 text-left">
                          <th className="py-3">Name</th>
                          <th>Email</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentUsers.map((user) => (
                          <tr
                            key={user._id}
                            className="border-b hover:bg-gray-50 transition"
                          >
                            <td className="py-3 font-medium text-gray-800">
                              {user.name}
                            </td>
                            <td>{user.email}</td>
                            <td>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ================= Reports ================= */}
          <Card className="shadow-sm border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Reports by Date
              </CardTitle>
            </CardHeader>

            <CardContent>
              {reportChartData.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No report data available 📊
                </div>
              ) : (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ================= Reusable Stat Card ================= */
function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
        <div className="text-primary">{icon}</div>
      </CardContent>
    </Card>
  );
}
