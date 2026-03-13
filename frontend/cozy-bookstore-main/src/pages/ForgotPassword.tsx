import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            <CardTitle className="text-2xl font-serif">
              {submitted ? "Check your email" : "Reset password"}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {submitted
                ? `We've sent a reset link to ${email}`
                : "Enter your email and we'll send you a reset link"}
            </p>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center space-y-6">
                <CheckCircle className="w-16 h-16 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary font-semibold hover:text-primary/80 transition-colors"
                  >
                    try again
                  </button>
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="reader@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10"
                    required
                  />
                </div>
                <Button type="submit" className="w-full text-base h-10 mt-6">
                  Send Reset Link
                </Button>
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
