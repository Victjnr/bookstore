import { motion } from "framer-motion";
import {
  BookOpen,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Star,
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

const stats = [
  { label: "Total Books", value: "2,847", change: "+12%", up: true, icon: BookOpen },
  { label: "Active Orders", value: "184", change: "+8%", up: true, icon: ShoppingCart },
  { label: "Customers", value: "12,493", change: "+23%", up: true, icon: Users },
  { label: "Revenue", value: "$48,295", change: "-3%", up: false, icon: TrendingUp },
];

const recentOrders = [
  { id: "ORD-001", customer: "Emily Brontë", book: "The Great Gatsby", amount: "$14.99", status: "paid" },
  { id: "ORD-002", customer: "James Joyce", book: "1984", amount: "$12.49", status: "shipped" },
  { id: "ORD-003", customer: "Virginia Woolf", book: "To Kill a Mockingbird", amount: "$11.99", status: "pending" },
  { id: "ORD-004", customer: "Mark Twain", book: "Pride and Prejudice", amount: "$9.99", status: "paid" },
  { id: "ORD-005", customer: "Oscar Wilde", book: "The Catcher in the Rye", amount: "$13.49", status: "cancelled" },
];

const topBooks = [
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", rating: 4.8, sales: 342 },
  { title: "1984", author: "George Orwell", rating: 4.7, sales: 298 },
  { title: "To Kill a Mockingbird", author: "Harper Lee", rating: 4.9, sales: 276 },
  { title: "Pride and Prejudice", author: "Jane Austen", rating: 4.6, sales: 254 },
];

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
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
              {topBooks.map((book, index) => (
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
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
