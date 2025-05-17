import CommunityChat from '@/components/community/CommunityChat';
import CommunityForum from '@/components/community/CommunityForum';
import { Title } from '@/components/layout/Title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CommunityPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="space-y-6">
        <Title
          title="Learniverse Community"
          description="Community discussions, connections, and learning opportunities."
          accentColor="amber"
        />

        <Tabs defaultValue="forum" className="w-full">
          <TabsList className="mb-6 mx-auto">
            <TabsTrigger value="forum" className="px-8">
              Forum
            </TabsTrigger>
            <TabsTrigger value="chat" className="px-8">
              Chat
            </TabsTrigger>
          </TabsList>
          <TabsContent value="forum">
            <CommunityForum />
          </TabsContent>
          <TabsContent value="chat">
            <CommunityChat />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
