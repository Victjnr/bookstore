import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ordersAPI } from "@/services/api";

interface OrderItem {
  book_id: string;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
}

const Orders = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth initialization
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ordersAPI.getUserOrders();
        const payload = res?.data ?? res;
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];
        setOrders(list as Order[]);
      } catch (err: any) {
        console.error("Failed to load orders:", err);
        setError(err.message || "Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/store")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Order History</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-4">
            {loading ? (
              <p className="text-center py-8">Loading orders...</p>
            ) : error ? (
              <p className="text-center text-destructive py-8">{error}</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-muted">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">No Orders Yet</h2>
                <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                <Button onClick={() => navigate("/store/browse")}>Start Shopping</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Order</th>
                      <th className="px-4 py-2 hidden sm:table-cell">Customer</th>
                      <th className="px-4 py-2">Items</th>
                      <th className="px-4 py-2">Total</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t">
                        <td className="px-4 py-3 font-medium">{order.id}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">{order.customer}</td>
                        <td className="px-4 py-3">
                          {order.items.map((i) => (
                            <div key={i.book_id} className="text-sm text-muted-foreground">
                              {i.title} × {i.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-3">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-3">{order.status}</td>
                        <td className="px-4 py-3">{order.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Orders;
