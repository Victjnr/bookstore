import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  BookOpen,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  AlertCircle,
  Loader,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dashboardAPI } from "@/services/api";

interface Stats {
  total_books: number;
  active_orders: number;
  total_customers: number;
  total_revenue: string;
}

interface Order {
  id: string;
  customer: string;
  book: string;
  amount: string;
  status: string;
}

interface TopSeller {
  title: string;
  author: string;
  rating: number;
  sales: number;
}

const statusColor: Record<string, string> = {
  paid: "bg-primary/10 text-primary border-primary/20",
  shipped: "bg-accent/10 text-accent border-accent/20",
  pending: "bg-secondary text-secondary-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topSellers, setTopSellers] = useState<TopSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardAPI.getDashboardData();
        
        if (response.success) {
          setStats(response.data.stats);
          setRecentOrders(response.data.recent_orders);
          setTopSellers(response.data.top_sellers);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Error loading dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Create stats array with dynamic data
  const statsArray = [
    {
      label: "Total Books",
      value: stats.total_books.toLocaleString(),
      change: "+12%",
      up: true,
      icon: BookOpen,
    },
    {
      label: "Active Orders",
      value: stats.active_orders.toLocaleString(),
      change: "+8%",
      up: true,
      icon: ShoppingCart,
    },
    {
      label: "Customers",
      value: stats.total_customers.toLocaleString(),
      change: "+23%",
      up: true,
      icon: Users,
    },
    {
      label: "Revenue",
      value: `$${stats.total_revenue}`,
      change: "-3%",
      up: false,
      icon: TrendingUp,
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsArray.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span
                    className={`text-sm font-medium flex items-center gap-1 ${
                      stat.up ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold font-serif text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-serif">Recent Orders</CardTitle>
                <CardDescription>Latest transactions from your store</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead className="hidden sm:table-cell">Customer</TableHead>
                      <TableHead className="hidden md:table-cell">Book</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell className="hidden sm:table-cell">{order.customer}</TableCell>
                        <TableCell className="hidden md:table-cell">{order.book}</TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColor[order.status]}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-6">No orders yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Books */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Top Sellers</CardTitle>
              <CardDescription>Best performing books this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topSellers.length > 0 ? (
                topSellers.map((book, index) => (
                  <div
                    key={book.title}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-lg font-bold font-serif text-muted-foreground w-6">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{book.title}</p>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-3 w-3 text-accent fill-accent" />
                        <span className="text-xs text-muted-foreground">{book.rating}</span>
                        <span className="text-xs text-muted-foreground">· {book.sales} sold</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-6">No sales yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
