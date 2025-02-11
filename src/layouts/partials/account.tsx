"use client";
import { useAppDispatch } from "@/redux/hook";
import { Button } from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Account = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const loginHandler = async () => {
    setLoading(true);
    const res: any = await signIn("credentials", {
      email: user.email,
      password: user.password,
      dispatch: dispatch,
      redirect: false,
    });

    if (res.status === 200) {
      setLoading(false);
      router.push("/");
    }

    if (res.status === 401) {
      setLoading(false);
      toast("Invalid Credentials");
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login Your Account</CardTitle>
        <CardDescription>
          Enter your email and password to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            onChange={(e: any) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            onChange={(e: any) =>
              setUser({ ...user, password: e.target.value })
            }
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full text-white" onClick={loginHandler}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Account;
