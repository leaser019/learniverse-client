import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function FeatureCard({ feature, index }) {
  return (
    <div className="" key={index}>
      <Card className="group h-full overflow-hidden border-0 bg-background/40 backdrop-blur-sm hover:bg-background/60 transition-all duration-300 shadow-lg shadow-teal-500/5 hover:shadow-teal-500/10 relative">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-500 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <div className="px-3 py-1 text-xs font-medium rounded-full bg-teal-500/10 text-teal-600 border border-teal-500/20">
              {feature.status}
            </div>
          </div>
          <CardTitle className="mt-5 text-foreground group-hover:text-teal-500 transition-colors duration-300">
            {feature.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 h-12 text-muted-foreground">
            {feature.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {feature.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-block px-3 py-1 text-xs rounded-full bg-background/60 text-muted-foreground border border-teal-500/10 group-hover:border-teal-500/20 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link href={feature.path} className="block mt-2">
            <Button className="w-full bg-gradient-to-r from-teal-500/80 to-teal-600/80 text-white hover:shadow-md hover:shadow-teal-500/20 transition-all duration-300">
              <span className="mr-2">Explore</span>
              <svg
                className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
