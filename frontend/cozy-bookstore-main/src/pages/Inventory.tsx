import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { booksAPI } from "@/services/api";

interface InventoryItem {
  id: string;
  title: string;
  stock: number;
}

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const response = await booksAPI.getAllBooks();

        let payload: any = response;
        if (response && response.success) payload = response.data ?? response;

        const list = Array.isArray(payload)
          ? payload
          : payload?.books ?? payload?.items ?? [];

        setItems(list);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Inventory;
