import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authAPI } from "@/services/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.signup({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      if (response.success && response.token) {
        // Store token and user data
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Redirect to store
        navigate("/store");
      } else {
        setError(response.message || "Signup failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-12 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif">Rail of Hope</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Create an account to start your reading journey
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Austen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="reader@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full text-base h-10 mt-6" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4 pt-4">
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
