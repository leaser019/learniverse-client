import {
    CodingChallenge,
    LeaderboardEntry,
    UserChallengeStats
} from "../types/CodingChallenge";

// Sample coding challenges
export const codingChallenges: CodingChallenge[] = [
  {
    id: "challenge-1",
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
    
You may assume that each input would have exactly one solution, and you may not use the same element twice.
    
Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    difficulty: "Easy",
    categories: ["Algorithm", "Data Structure"],
    supportedLanguages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    points: 100,
    timeLimit: 30,
    startCode: {
      "JavaScript": `function twoSum(nums, target) {
  // Your code here
};`,
      "TypeScript": `function twoSum(nums: number[], target: number): number[] {
  // Your code here
  return [];
};`,
      "Python": `def two_sum(nums, target):
    # Your code here
    pass`,
      "Java": `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{0, 0};
    }
}`,
      "C++": "",
      "Go": "",
      "Rust": "",
      "SQL": ""
    },
    testCases: [
      {
        input: "[2,7,11,15], 9",
        output: "[0,1]"
      },
      {
        input: "[3,2,4], 6",
        output: "[1,2]"
      },
      {
        input: "[3,3], 6",
        output: "[0,1]"
      }
    ],
    hints: ["Try using a hash map to store the values you've seen so far."],
    createdAt: "2025-05-14T10:00:00Z",
    dailyChallenge: true
  },
  {
    id: "challenge-2",
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false`,
    difficulty: "Easy",
    categories: ["Algorithm", "Data Structure"],
    supportedLanguages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    points: 150,
    timeLimit: 30,
    startCode: {
      "JavaScript": `function isValid(s) {
  // Your code here
};`,
      "TypeScript": `function isValid(s: string): boolean {
  // Your code here
  return false;
};`,
      "Python": `def is_valid(s):
    # Your code here
    pass`,
      "Java": `class Solution {
    public boolean isValid(String s) {
        // Your code here
        return false;
    }
}`,
      "C++": "",
      "Go": "",
      "Rust": "",
      "SQL": ""
    },
    testCases: [
      {
        input: '"()"',
        output: "true"
      },
      {
        input: '"()[]{}"',
        output: "true"
      },
      {
        input: '"(]"',
        output: "false"
      },
      {
        input: '"([)]"',
        output: "false"
      },
      {
        input: '"{[]}"',
        output: "true"
      }
    ],
    hints: ["Try using a stack data structure", "Think about what happens when you encounter a closing bracket"],
    createdAt: "2025-05-13T10:00:00Z"
  },
  {
    id: "challenge-3",
    title: "Reverse Linked List",
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

Example 1:
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

Example 2:
Input: head = [1,2]
Output: [2,1]

Example 3:
Input: head = []
Output: []`,
    difficulty: "Medium",
    categories: ["Algorithm", "Data Structure"],
    supportedLanguages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    points: 200,
    timeLimit: 45,
    startCode: {
      "JavaScript": `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
    // Your code here
};`,
      "TypeScript": `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function reverseList(head: ListNode | null): ListNode | null {
    // Your code here
    return null;
};`,
      "Python": `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        # Your code here
        pass`,
      "Java": `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // Your code here
        return null;
    }
}`,
      "C++": "",
      "Go": "",
      "Rust": "",
      "SQL": ""
    },
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "[5,4,3,2,1]"
      },
      {
        input: "[1,2]",
        output: "[2,1]"
      },
      {
        input: "[]",
        output: "[]"
      }
    ],
    hints: ["Try using multiple pointers", "Think about how to iteratively reverse the links"],
    createdAt: "2025-05-12T10:00:00Z"
  },
  {
    id: "challenge-4",
    title: "Create a React Counter Component",
    description: `Create a simple counter component in React that has:
1. A display showing the current count (starting at 0)
2. An increment button that adds 1 to the count
3. A decrement button that subtracts 1 from the count
4. A reset button that sets the count back to 0
5. The counter should not go below 0

Style it with a clean, modern UI.`,
    difficulty: "Easy",
    categories: ["Frontend", "Web Development"],
    supportedLanguages: ["JavaScript", "TypeScript"],
    defaultLanguage: "JavaScript",
    points: 150,
    timeLimit: 40,
    startCode: {
      "JavaScript": `import React, { useState } from 'react';

export default function Counter() {
  // Your code here
}`,
      "TypeScript": `import React, { useState } from 'react';

export default function Counter(): JSX.Element {
  // Your code here
  return (
    <div>
      
    </div>
  );
}`,
      "Python": "",
      "Java": "",
      "C++": "",
      "Go": "",
      "Rust": "",
      "SQL": ""
    },
    testCases: [
      {
        input: "click increment button once",
        output: "count displays 1"
      },
      {
        input: "click decrement button when count is 0",
        output: "count remains 0"
      },
      {
        input: "click reset button when count is not 0",
        output: "count resets to 0"
      }
    ],
    hints: ["Use the useState hook to manage the counter state", "Remember to add a guard against negative values"],
    createdAt: "2025-05-11T10:00:00Z"
  },
  {
    id: "challenge-5",
    title: "SQL Database Query Optimization",
    description: `You have three tables: Users, Orders, and Products.

Users: id, name, email, created_at
Orders: id, user_id, status, total, created_at
Products: id, name, price, category

Write an SQL query to find the top 5 users who have spent the most money on successful orders (status = 'completed'), along with their total spend amount, sorted by the amount in descending order.`,
    difficulty: "Medium",
    categories: ["Database", "Backend"],
    supportedLanguages: ["SQL"],
    defaultLanguage: "SQL",
    points: 250,
    timeLimit: 35,
    startCode: {
      "JavaScript": "",
      "TypeScript": "",
      "Python": "",
      "Java": "",
      "C++": "",
      "Go": "",
      "Rust": "",
      "SQL": `-- Write your SQL query here

`
    },
    testCases: [
      {
        input: "Users and Orders tables with sample data",
        output: "Top 5 users with their total spend amount"
      }
    ],
    hints: ["Make sure to join the Users and Orders tables", "Use the SUM aggregate function", "Don't forget to group by user"],
    createdAt: "2025-05-10T10:00:00Z"
  }
];

// Sample leaderboard entries
export const leaderboardData: LeaderboardEntry[] = [
  {
    userId: "user1",
    username: "codemaster",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    totalPoints: 3250,
    rank: 1,
    totalSolved: 45,
    streakDays: 28,
    badges: [
      {
        id: "badge1",
        name: "Algorithm Master",
        description: "Solved 30+ algorithm challenges",
        iconUrl: "/badges/algorithm-master.svg",
        earnedAt: "2025-04-15T10:00:00Z"
      },
      {
        id: "badge2",
        name: "30-Day Streak",
        description: "Maintained a 30-day coding streak",
        iconUrl: "/badges/streak-30.svg",
        earnedAt: "2025-05-10T10:00:00Z"
      }
    ]
  },
  {
    userId: "user2",
    username: "devninja",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    totalPoints: 2980,
    rank: 2,
    totalSolved: 38,
    streakDays: 15,
    badges: [
      {
        id: "badge3",
        name: "Frontend Wizard",
        description: "Completed 20+ frontend challenges",
        iconUrl: "/badges/frontend-wizard.svg",
        earnedAt: "2025-04-20T10:00:00Z"
      }
    ]
  },
  {
    userId: "user3",
    username: "algoqueen",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    totalPoints: 2750,
    rank: 3,
    totalSolved: 35,
    streakDays: 10,
    badges: [
      {
        id: "badge4",
        name: "Database Expert",
        description: "Solved 15+ database challenges",
        iconUrl: "/badges/database-expert.svg",
        earnedAt: "2025-05-01T10:00:00Z"
      }
    ]
  },
  {
    userId: "user4",
    username: "codewarrior",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    totalPoints: 2500,
    rank: 4,
    totalSolved: 32,
    streakDays: 8,
    badges: []
  },
  {
    userId: "user5",
    username: "pythonista",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    totalPoints: 2350,
    rank: 5,
    totalSolved: 30,
    streakDays: 5,
    badges: []
  },
  {
    userId: "user6",
    username: "jslegend",
    avatarUrl: "https://i.pravatar.cc/150?img=6",
    totalPoints: 2100,
    rank: 6,
    totalSolved: 28,
    streakDays: 12,
    badges: []
  },
  {
    userId: "user7",
    username: "datastructureguru",
    avatarUrl: "https://i.pravatar.cc/150?img=7",
    totalPoints: 1950,
    rank: 7,
    totalSolved: 25,
    streakDays: 3,
    badges: []
  },
  {
    userId: "user8",
    username: "reactrocket",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    totalPoints: 1800,
    rank: 8,
    totalSolved: 23,
    streakDays: 7,
    badges: []
  },
  {
    userId: "user9",
    username: "goexplorer",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    totalPoints: 1650,
    rank: 9,
    totalSolved: 20,
    streakDays: 4,
    badges: []
  },
  {
    userId: "user10",
    username: "fullstackpro",
    avatarUrl: "https://i.pravatar.cc/150?img=10",
    totalPoints: 1500,
    rank: 10,
    totalSolved: 18,
    streakDays: 6,
    badges: []
  }
];

// Sample user stats
export const userChallengeStats: UserChallengeStats = {
  userId: "current-user",
  totalSolved: 22,
  easySolved: 15,
  mediumSolved: 5,
  hardSolved: 2, 
  expertSolved: 0,
  totalPoints: 1850,
  streakDays: 7,
  lastActiveDate: "2025-05-14T10:00:00Z",
  submissions: [
    {
      id: "submission1",
      userId: "current-user",
      challengeId: "challenge-1",
      code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
};`,
      language: "JavaScript",
      status: "Accepted",
      runtime: 76,
      memory: 42500,
      score: 100,
      submittedAt: "2025-05-14T15:30:00Z",
      passedTestCases: 3,
      totalTestCases: 3
    },
    {
      id: "submission2",
      userId: "current-user",
      challengeId: "challenge-2",
      code: `function isValid(s) {
  const stack = [];
  const pairs = { '(': ')', '{': '}', '[': ']' };
  
  for (let char of s) {
    if (char in pairs) {
      stack.push(char);
    } else {
      const last = stack.pop();
      if (pairs[last] !== char) return false;
    }
  }
  
  return stack.length === 0;
};`,
      language: "JavaScript",
      status: "Accepted",
      runtime: 62,
      memory: 38400,
      score: 150,
      submittedAt: "2025-05-13T11:45:00Z",
      passedTestCases: 5,
      totalTestCases: 5
    }
  ]
};
