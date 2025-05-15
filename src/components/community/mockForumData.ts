export const mockTopics = [
  { id: '1', name: 'Drama học đường' },
  { id: '2', name: 'Chia sẻ kinh nghiệm' },
  { id: '3', name: 'Hỏi đáp code cháy máy' },
  { id: '4', name: 'Tám chuyện linh tinh' },
];

export const mockPosts = [
  {
    id: '101',
    content: 'Ai có tips học code không bị buồn ngủ không? Mình sắp thành zombie rồi!',
    author: 'Coder Lầy',
    createdAt: new Date().toISOString(),
    topicId: '3',
    topicName: 'Hỏi đáp code cháy máy',
    votes: 3,
    comments: [
      { id: 'c1', content: 'Uống trà sữa code xuyên đêm nha!', author: 'Trà Sữa', createdAt: new Date().toISOString() },
    ],
  },
  {
    id: '102',
    content: 'Drama mới: crush rep tin nhắn sau 3 ngày, mình nên làm gì tiếp?',
    author: 'Drama King',
    createdAt: new Date().toISOString(),
    topicId: '1',
    topicName: 'Drama học đường',
    votes: 5,
    comments: [
      { id: 'c2', content: 'Chờ tiếp đi bro, kiên nhẫn là chìa khoá!', author: 'Kiên Nhẫn', createdAt: new Date().toISOString() },
    ],
  },
];
