import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  BadgeCheck, ChevronDown, Clock3, Filter, SortAsc,
  Star,
  X,
  Zap
} from "lucide-react";
import { useState } from "react";

type FilterOption = {
  value: string;
  label: string;
  count: number;
  icon?: React.ReactNode;
};

export const CourseFilters = ({
  onFilterChange
}: {
  onFilterChange: (filters: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState<[number, number]>([0, 2000000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("popular");

  const categories: FilterOption[] = [
    { value: "programming", label: "Lập trình", count: 428 },
    { value: "design", label: "Thiết kế", count: 235 },
    { value: "business", label: "Kinh doanh", count: 185 },
    { value: "marketing", label: "Marketing", count: 142 },
    { value: "photography", label: "Nhiếp ảnh", count: 92 },
    { value: "music", label: "Âm nhạc", count: 76 },
  ];

  const levels: FilterOption[] = [
    { value: "beginner", label: "Mới bắt đầu", count: 352, icon: <Zap size={16} /> },
    { value: "intermediate", label: "Trung cấp", count: 245, icon: <Clock3 size={16} /> },
    { value: "advanced", label: "Nâng cao", count: 122, icon: <BadgeCheck size={16} /> },
  ];

  const ratings: FilterOption[] = [
    { value: "4.5", label: "4.5 trở lên", count: 235, icon: <Star size={16} className="fill-amber-500 text-amber-500" /> },
    { value: "4", label: "4.0 trở lên", count: 512, icon: <Star size={16} className="fill-amber-500 text-amber-500" /> },
    { value: "3.5", label: "3.5 trở lên", count: 632, icon: <Star size={16} className="fill-amber-500 text-amber-500" /> },
  ];

  const sortOptions: FilterOption[] = [
    { value: "popular", label: "Phổ biến nhất", count: 0, icon: <Zap size={16} /> },
    { value: "newest", label: "Mới nhất", count: 0, icon: <BadgeCheck size={16} /> },
    { value: "price-low", label: "Giá thấp nhất", count: 0, icon: <SortAsc size={16} /> },
    { value: "price-high", label: "Giá cao nhất", count: 0, icon: <SortAsc size={16} className="rotate-180" /> },
  ];

  const handleFilterApply = () => {
    onFilterChange({
      price,
      category: selectedCategory,
      level: selectedLevel,
      rating: selectedRating,
      sort: selectedSort,
    });
  };

  const resetFilters = () => {
    setPrice([0, 2000000]);
    setSelectedCategory(null);
    setSelectedLevel(null);
    setSelectedRating(null);
    setSelectedSort("popular");
    onFilterChange({
      price: [0, 2000000],
      category: null,
      level: null,
      rating: null,
      sort: "popular",
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Bộ lọc
            <ChevronDown size={16} className={cn('transition-transform', isOpen && 'rotate-180')} />
          </Button>

          {/* Display active filters as pills */}
          {selectedCategory && (
            <Button
              size="sm"
              variant="secondary"
              className="flex gap-1 items-center"
              onClick={() => setSelectedCategory(null)}
            >
              {categories.find((c) => c.value === selectedCategory)?.label}
              <X size={14} />
            </Button>
          )}

          {selectedLevel && (
            <Button
              size="sm"
              variant="secondary"
              className="flex gap-1 items-center"
              onClick={() => setSelectedLevel(null)}
            >
              {levels.find((l) => l.value === selectedLevel)?.label}
              <X size={14} />
            </Button>
          )}

          {selectedRating && (
            <Button
              size="sm"
              variant="secondary"
              className="flex gap-1 items-center"
              onClick={() => setSelectedRating(null)}
            >
              {ratings.find((r) => r.value === selectedRating)?.label}
              <X size={14} />
            </Button>
          )}

          {(selectedCategory ||
            selectedLevel ||
            selectedRating ||
            price[0] > 0 ||
            price[1] < 2000000) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={resetFilters}
              className="text-red-500 hover:text-red-700"
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        <div className="flex-shrink-0">
          <RadioGroup
            value={selectedSort}
            onValueChange={setSelectedSort}
            className="flex bg-muted p-1 rounded-md"
          >
            {sortOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-1">
                <RadioGroupItem
                  value={option.value}
                  id={`sort-${option.value}`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`sort-${option.value}`}
                  className={cn(
                    'flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm cursor-pointer',
                    selectedSort === option.value
                      ? 'bg-background shadow-sm'
                      : 'hover:bg-background/50'
                  )}
                >
                  {option.icon}
                  <span className="hidden sm:inline">{option.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 p-5 border rounded-lg grid grid-cols-1 md:grid-cols-4 gap-6 bg-card">
          <div>
            <h3 className="font-medium mb-3">Danh mục</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category.value}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-muted',
                    selectedCategory === category.value && 'bg-muted'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={selectedCategory === category.value}
                      onChange={() =>
                        setSelectedCategory(
                          selectedCategory === category.value ? null : category.value
                        )
                      }
                      className="sr-only"
                    />
                    <span>{category.label}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{category.count}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Cấp độ</h3>
            <div className="space-y-2">
              {levels.map((level) => (
                <label
                  key={level.value}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-muted',
                    selectedLevel === level.value && 'bg-muted'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="level"
                      value={level.value}
                      checked={selectedLevel === level.value}
                      onChange={() =>
                        setSelectedLevel(selectedLevel === level.value ? null : level.value)
                      }
                      className="sr-only"
                    />
                    {level.icon}
                    <span>{level.label}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{level.count}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Đánh giá</h3>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <label
                  key={rating.value}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-muted',
                    selectedRating === rating.value && 'bg-muted'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rating"
                      value={rating.value}
                      checked={selectedRating === rating.value}
                      onChange={() =>
                        setSelectedRating(selectedRating === rating.value ? null : rating.value)
                      }
                      className="sr-only"
                    />
                    {rating.icon}
                    <span>{rating.label}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{rating.count}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Khoảng giá</h3>
            <div className="px-3">
              <Slider
                defaultValue={price}
                max={2000000}
                step={50000}
                value={price}
                onValueChange={(value) => setPrice(value as [number, number])}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <div className="bg-muted px-3 py-1.5 rounded-md text-sm">
                  {price[0]?.toLocaleString()}đ
                </div>
                <div className="bg-muted px-3 py-1.5 rounded-md text-sm">
                  {price[1]?.toLocaleString()}đ
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-end gap-2 mt-4 border-t pt-4">
            <Button variant="outline" onClick={resetFilters}>
              Đặt lại
            </Button>
            <Button onClick={handleFilterApply}>Áp dụng</Button>
          </div>
        </div>
      )}
    </div>
  );
};