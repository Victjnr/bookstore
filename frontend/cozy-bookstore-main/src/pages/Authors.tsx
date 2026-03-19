import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { dashboardAPI } from "@/services/api";

interface Author {
  id: string;
  name: string;
  bio: string;
  books_count: number;
}

const Authors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      try {
        const response = await dashboardAPI.getDashboardData();

        // Normalize shape: response may be { success, data: { authors: [...] } } or { authors: [...] }
        let payload: any = response;
        if (response && response.success) payload = response.data ?? response;

        const list = Array.isArray(payload)
          ? payload
          : payload?.authors ?? payload?.data?.authors ?? [];

        setAuthors(list);
      } catch (err) {
        console.error("Failed to fetch authors:", err);
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authors</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead>Books</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>{author.name}</TableCell>
                  <TableCell>{author.bio}</TableCell>
                  <TableCell>{author.books_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Authors;
