import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OnBoarding() {
  return (
    <div className="max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Create Company Email Account</CardTitle>
          <CardDescription>
            Set up your company email address using the format:
            name.themefisher@gmail.com
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
