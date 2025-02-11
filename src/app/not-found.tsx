import { Button } from "@/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-light">
      <div className="p-20 flex flex-col items-center rounded-lg bg-background">
        <h1 className="text-center h3 mb-4">Page Not Found!</h1>
        <p className="text-center text-text-light">
          The page you are looking for does not exist.
        </p>
        <div>
          <Button variant="outline" className="mt-5">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
