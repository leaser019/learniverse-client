'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Award, Code, Layout, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function MySpaceLayout({ children }) {
  const pathname = usePathname();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            My Space 🚀
          </h1>
          <p className="text-gray-500">
            Không gian cá nhân để nâng cao kỹ năng coding, theo dõi tiến độ và tham gia các thử thách
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
              <Plus className="mr-2 h-4 w-4" /> Tạo Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tạo Challenge Mới</DialogTitle>
              <DialogDescription>
                Tạo challenge mới để chia sẻ với cộng đồng. Challenges hay sẽ được đưa vào bộ sưu tập chính.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề Challenge</Label>
                <Input id="title" placeholder="Nhập tiêu đề challenge..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Độ khó</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn độ khó" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Array">Array</SelectItem>
                      <SelectItem value="String">String</SelectItem>
                      <SelectItem value="Linked List">Linked List</SelectItem>
                      <SelectItem value="Tree">Tree</SelectItem>
                      <SelectItem value="Graph">Graph</SelectItem>
                      <SelectItem value="Dynamic Programming">Dynamic Programming</SelectItem>
                      <SelectItem value="Algorithm">Algorithm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea 
                  id="description" 
                  placeholder="Mô tả chi tiết về challenge..." 
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="testcases">Test Cases (Mỗi dòng gồm input và output, cách nhau bởi dấu |)</Label>
                <Textarea 
                  id="testcases" 
                  placeholder="Input1 | Output1&#10;Input2 | Output2" 
                  className="font-mono text-sm min-h-[80px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button 
                className="bg-gradient-to-r from-pink-500 to-purple-500"
                onClick={() => {
                  // Xử lý tạo challenge mới
                  setIsCreateDialogOpen(false);
                  // Hiển thị thông báo thành công
                }}
              >
                Tạo Challenge
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="mb-8">
        <Tabs defaultValue={pathname} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-xl mb-8">
            <TabsTrigger value="/my-space" asChild>
              <Link href="/my-space" className={`flex items-center gap-2 ${isActive('/my-space') ? 'bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white' : ''}`}>
                <Code className="h-4 w-4" />
                <span>Challenges</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="/my-space/dashboard" asChild>
              <Link href="/my-space/dashboard" className={`flex items-center gap-2 ${isActive('/my-space/dashboard') ? 'bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white' : ''}`}>
                <Layout className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="/my-space/achievements" asChild>
              <Link href="/my-space/achievements" className={`flex items-center gap-2 ${isActive('/my-space/achievements') ? 'bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white' : ''}`}>
                <Award className="h-4 w-4" />
                <span>Thành tựu</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {children}
    </div>
  );
}
