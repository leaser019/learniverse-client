'use client';

import { Title } from '@/components/layout/Title';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
      <Title
        title="My Space"
        description="Your personal space to create, manage, and share coding challenges with the community."
      />

      <div className="mb-8">
        <div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Challenge</DialogTitle>
                <DialogDescription>
                  Create a new challenge to share with the community. Great challenges will be added
                  to the main collection.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input id="title" placeholder="Enter challenge title..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Difficulty" />
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
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Category" />
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Description about challenge..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="testcases">
                    Test Cases (Each line consists of input and output, separated by |)
                  </Label>
                  <Textarea
                    id="testcases"
                    placeholder="Input1 | Output1&#10;Input2 | Output2"
                    className="font-mono text-sm min-h-[80px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-pink-500 to-purple-500"
                  onClick={() => {
                    // Xử lý tạo challenge mới
                    setIsCreateDialogOpen(false);
                    // Hiển thị thông báo thành công
                  }}
                >
                  Create Challenge
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Tabs defaultValue={pathname} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <TabsList className="grid grid-cols-3 w-full max-w-xl mb-8">
                <TabsTrigger value="/my-space" asChild>
                  <Link
                    href="/my-space"
                    className={`flex items-center gap-2 ${
                      isActive('/my-space')
                        ? 'bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white'
                        : ''
                    }`}
                  >
                    <Code className="h-4 w-4" />
                    <span>Challenges</span>
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="/my-space/dashboard" asChild>
                  <Link
                    href="/my-space/dashboard"
                    className={`flex items-center gap-2 ${
                      isActive('/my-space/dashboard')
                        ? 'bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white'
                        : ''
                    }`}
                  >
                    <Layout className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="/my-space/achievements" asChild>
                  <Link
                    href="/my-space/achievements"
                    className={`flex items-center gap-2 ${
                      isActive('/my-space/achievements')
                        ? 'bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white'
                        : ''
                    }`}
                  >
                    <Award className="h-4 w-4" />
                    <span>Achievements</span>
                  </Link>
                </TabsTrigger>
              </TabsList>
            </div>
            <div>
              <Button
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Create Challenge
              </Button>
            </div>
          </div>
        </Tabs>
      </div>

      {children}
    </div>
  );
}
