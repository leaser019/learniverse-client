import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BookOpen, Clock, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;
  duration: string;
  level: string;
  enrollmentCount: number;
  price: number | "Free";
  categories: string[];
}

export function CourseCard({
  id,
  title,
  instructor,
  thumbnailUrl,
  rating,
  reviewCount,
  duration,
  level,
  enrollmentCount,
  price,
  categories,
}: CourseCardProps) {
  return (
    <Link href={`/course/${id}`}>
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {price === "Free" ? (
            <Badge className="absolute top-2 right-2 bg-green-500">Free</Badge>
          ) : (
            <Badge className="absolute top-2 right-2">{price.toLocaleString()}đ</Badge>
          )}
          <Badge variant="outline" className="absolute top-2 left-2 bg-black/60 text-white">
            {level}
          </Badge>
        </div>
        
        <CardHeader className="p-3 pb-0">
          <h3 className="font-semibold line-clamp-2 text-base group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm">{instructor}</p>
        </CardHeader>
        
        <CardContent className="p-3 pt-1">
          <div className="flex items-center text-sm space-x-1">
            <span className="text-amber-500 font-bold">{rating.toFixed(1)}</span>
            <div className="flex items-center">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < Math.round(rating) ? "fill-amber-500 text-amber-500" : "text-gray-300"} 
                />
              ))}
            </div>
            <span className="text-muted-foreground">({reviewCount})</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {categories.slice(0, 2).map((category) => (
              <Badge variant="secondary" key={category} className="text-xs font-normal">
                {category}
              </Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{categories.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-3 pt-0 flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{enrollmentCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>5 modules</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}