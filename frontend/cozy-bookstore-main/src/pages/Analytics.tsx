import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { dashboardAPI } from "@/services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const COLORS = ["#4F46E5", "#06B6D4", "#F97316", "#EF4444", "#10B981", "#8B5CF6"];

const Analytics = () => {
  const [salesOverTime, setSalesOverTime] = useState<Record<string, number>>({});
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, number>>({});
  const [booksByGenre, setBooksByGenre] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const [salesRes, statusRes, genreRes] = await Promise.all([
          dashboardAPI.salesOverTime(),
          dashboardAPI.ordersByStatus(),
          dashboardAPI.booksByGenre(),
        ]);

        // Normalize numeric data
        const salesData = salesRes?.data ?? salesRes ?? {};
        const statusData = statusRes?.data ?? statusRes ?? {};
        const genreData = genreRes?.data ?? genreRes ?? {};

        // Convert strings to numbers where necessary
        const parsedSales: Record<string, number> = {};
        Object.entries(salesData).forEach(([k, v]) => {
          parsedSales[k] = Number(v) || 0;
        });

        setSalesOverTime(parsedSales);
        setOrdersByStatus(
          Object.fromEntries(Object.entries(statusData).map(([k, v]) => [k, Number(v) || 0]))
        );
        setBooksByGenre(
          Object.fromEntries(Object.entries(genreData).map(([k, v]) => [k, Number(v) || 0]))
        );
      } catch (err: any) {
        console.error("Failed to load analytics:", err);
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const salesArray = useMemo(() => {
    return Object.entries(salesOverTime)
      .map(([day, total]) => ({ day, total }))
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  }, [salesOverTime]);

  const statusArray = useMemo(() => {
    return Object.entries(ordersByStatus).map(([status, value]) => ({ name: status, value }));
  }, [ordersByStatus]);

  const genreArray = useMemo(() => {
    return Object.entries(booksByGenre).map(([genre, value]) => ({ genre, value }));
  }, [booksByGenre]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif">Analytics</h1>
      {loading ? (
        <p>Loading analytics...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Over Time (last 30 days)</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 240 }}>
              {salesArray.length === 0 ? (
                <p className="text-muted-foreground">No sales data</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesArray}>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Line type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders by Status</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 240 }}>
              {statusArray.length === 0 ? (
                <p className="text-muted-foreground">No orders</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusArray} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#8884d8">
                      {statusArray.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Books by Genre (last 30 days)</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 240 }}>
              {genreArray.length === 0 ? (
                <p className="text-muted-foreground">No genre data</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genreArray} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="genre" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#06B6D4" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;
