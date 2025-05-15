import { CodingChallenge } from "../types/CodingChallenge";

// Mock coding challenges for local development
export const mockChallenges: CodingChallenge[] = [
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
}`
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
    hints: [
      "Try using a hash map to store the values you've seen so far.",
      "You can solve this in a single pass through the array.",
      "For each element, check if its complement (target - current value) exists in the hash map."
    ],
    createdAt: "2025-05-14T10:00:00Z",
    dailyChallenge: false
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
    categories: ["Algorithm", "Data Structure", "Stack"],
    supportedLanguages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    points: 150,
    timeLimit: 30,
    startCode: {
      "JavaScript": `function isValid(s) {
  // Your code here
  return true;
};`,
      "TypeScript": `function isValid(s: string): boolean {
  // Your code here
  return false;
};`,
      "Python": `def is_valid(s):
    # Your code here
    return True`,
      "Java": `class Solution {
    public boolean isValid(String s) {
        // Your code here
        return false;
    }
}`
    },
    testCases: [
      {
        input: "()",
        output: "true"
      },
      {
        input: "()[]{}",
        output: "true"
      },
      {
        input: "(]",
        output: "false"
      },
      {
        input: "([)]",
        output: "false"
      },
      {
        input: "{[]}",
        output: "true"
      }
    ],
    hints: [
      "Consider using a stack data structure.",
      "Push opening brackets onto the stack and pop when you encounter closing brackets.",
      "Check if the popped bracket matches the current closing bracket."
    ],
    createdAt: "2025-05-14T11:30:00Z",
    dailyChallenge: false
  },
  {
    id: "challenge-3",
    title: "Maximum Subarray",
    description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A subarray is a contiguous part of an array.

Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.

Example 2:
Input: nums = [1]
Output: 1

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23`,
    difficulty: "Medium",
    categories: ["Algorithm", "Dynamic Programming", "Array"],
    supportedLanguages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    points: 200,
    timeLimit: 45,
    startCode: {
      "JavaScript": `function maxSubArray(nums) {
  // Your code here
};`,
      "TypeScript": `function maxSubArray(nums: number[]): number {
  // Your code here
  return 0;
};`,
      "Python": `def max_sub_array(nums):
    # Your code here
    pass`,
      "Java": `class Solution {
    public int maxSubArray(int[] nums) {
        // Your code here
        return 0;
    }
}`
    },
    testCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        output: "6"
      },
      {
        input: "[1]",
        output: "1"
      },
      {
        input: "[5,4,-1,7,8]",
        output: "23"
      }
    ],
    hints: [
      "Try using Kadane's Algorithm for an O(n) solution.",
      "Keep track of current sum and maximum sum found so far.",
      "If current sum becomes negative, reset it to zero."
    ],
    createdAt: "2025-05-15T09:15:00Z",
    dailyChallenge: true
  },
  {
    id: "challenge-4",
    title: "Merge Two Sorted Lists",
    description: `Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.

Example 1:
Input: l1 = [1,2,4], l2 = [1,3,4]
Output: [1,1,2,3,4,4]

Example 2:
Input: l1 = [], l2 = []
Output: []

Example 3:
Input: l1 = [], l2 = [0]
Output: [0]`,
    difficulty: "Easy",
    categories: ["Algorithm", "Linked List"],
    supportedLanguages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    points: 120,
    timeLimit: 25,
    startCode: {
      "JavaScript": `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function mergeTwoLists(l1, l2) {
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
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  // Your code here
  return null;
};`,
      "Python": `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
def merge_two_lists(l1, l2):
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
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        // Your code here
        return null;
    }
}`
    },
    testCases: [
      {
        input: "[1,2,4], [1,3,4]",
        output: "[1,1,2,3,4,4]"
      },
      {
        input: "[], []",
        output: "[]"
      },
      {
        input: "[], [0]",
        output: "[0]"
      }
    ],
    hints: [
      "Use a dummy head node to simplify the code.",
      "Compare values of nodes from both lists and add the smaller one to the result.",
      "Don't forget to handle the case when one list is exhausted but the other still has nodes."
    ],
    createdAt: "2025-05-15T14:20:00Z",
    dailyChallenge: false
  },
  {
    id: "challenge-5",
    title: "Reverse Integer",
    description: `Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.

Assume the environment does not allow you to store 64-bit integers (signed or unsigned).

Example 1:
Input: x = 123
Output: 321

Example 2:
Input: x = -123
Output: -321

Example 3:
Input: x = 120
Output: 21`,
    difficulty: "Medium",
    categories: ["Math", "Algorithm"],
    supportedLanguages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    points: 180,
    timeLimit: 40,
    startCode: {
      "JavaScript": `function reverse(x) {
  // Your code here
};`,
      "TypeScript": `function reverse(x: number): number {
  // Your code here
  return 0;
};`,
      "Python": `def reverse(x):
    # Your code here
    pass`,
      "Java": `class Solution {
    public int reverse(int x) {
        // Your code here
        return 0;
    }
}`
    },
    testCases: [
      {
        input: "123",
        output: "321"
      },
      {
        input: "-123",
        output: "-321"
      },
      {
        input: "120",
        output: "21"
      },
      {
        input: "0",
        output: "0"
      }
    ],
    hints: [
      "Be careful about integer overflow.",
      "Consider using modulo (%) to get the last digit and division (/) to remove it.",
      "Check if the reversed number is within the 32-bit integer range before returning."
    ],
    createdAt: "2025-05-15T16:45:00Z",
    dailyChallenge: false
  }
];