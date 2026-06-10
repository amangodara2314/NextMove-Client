import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-6 bg-secondary p-6 grow">
      <Card>
        <CardContent className="grid grid-cols-2">
          <p>Card Content</p>
        </CardContent>
      </Card>
    </div>
  );
}
