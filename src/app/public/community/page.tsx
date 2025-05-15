import CommunityChat from '@/components/community/CommunityChat';
import CommunityForum from '@/components/community/CommunityForum';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CommunityPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="forum">
          <CommunityForum />
        </TabsContent>
        <TabsContent value="chat">
          <CommunityChat />
        </TabsContent>
      </Tabs>
    </div>
  );
}
