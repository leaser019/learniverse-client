import { ChallengeCategory, ChallengeLanguage, CodingChallenge, DifficultyLevel } from "../../types/CodingChallenge";
import { GeminiService } from "./GeminiService";

export class ChallengeGeneratorService {
  static async generateDailyChallenge(apiKey: string): Promise<CodingChallenge> {
    const geminiService = GeminiService.getInstance(apiKey);
    
    const prompt = `
    Generate a coding challenge with the following structure:
    1. Title: A catchy, descriptive name for the challenge
    2. Description: A clear problem statement with examples and expected outputs
    3. Difficulty: Choose one from [Easy, Medium, Hard, Expert]
    4. Categories: One or more from [Algorithm, Data Structure, Web Development, Database, Machine Learning, Frontend, Backend]
    5. Supported Languages: Choose from [JavaScript, TypeScript, Python, Java]
    6. Default Language: The primary language for this challenge
    7. Points: A value between 100-500 based on difficulty
    8. Time Limit: Time in minutes to complete the challenge
    9. Starter Code: Provide template code for each supported language
    10. Test Cases: At least 3 input/output pairs to validate solutions
    11. Hints: 1-3 useful tips without giving away the solution

    Format the response as a JSON object that matches this structure. Be creative but ensure the challenge is solvable and interesting.
    `;

    const systemPrompt = `You are an expert competitive programming challenge creator. Your task is to create interesting, educational coding challenges that help programmers improve their skills. Format your response as clean JSON without any commentary or markdown.`;

    try {
      const result = await geminiService.generateContent(prompt, "gemini-2.0-flash", systemPrompt);
      
      // Parse the response and extract the challenge JSON
      let challengeJson;
      try {
        // Extract JSON from text response
        const responseText = result.response.text();
        // Find JSON content between brackets
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          challengeJson = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract valid JSON from response");
        }
      } catch (error) {
        console.error("Error parsing challenge JSON:", error);
        throw new Error("Failed to parse the generated challenge");
      }

      // Create a properly formatted challenge
      const challenge: CodingChallenge = {
        id: `challenge-${Date.now()}`,
        title: challengeJson.title || "Daily Coding Challenge",
        description: challengeJson.description || "Solve this coding problem",
        difficulty: (challengeJson.difficulty as DifficultyLevel) || "Medium",
        categories: (challengeJson.categories as ChallengeCategory[]) || ["Algorithm"],
        supportedLanguages: (challengeJson.supportedLanguages as ChallengeLanguage[]) || ["JavaScript", "Python"],
        defaultLanguage: (challengeJson.defaultLanguage as ChallengeLanguage) || "JavaScript",
        points: challengeJson.points || 200,
        timeLimit: challengeJson.timeLimit || 30,
        startCode: challengeJson.starterCode || {
          "JavaScript": "// Your code here",
          "TypeScript": "// Your code here",
          "Python": "# Your code here",
          "Java": "// Your code here",
          "C++": "",
          "Go": "",
          "Rust": "",
          "SQL": ""
        },
        testCases: challengeJson.testCases || [
          { input: "sample input", output: "expected output" }
        ],
        hints: challengeJson.hints || ["Think carefully about the problem"],
        createdAt: new Date().toISOString(),
        dailyChallenge: true
      };

      return challenge;
    } catch (error) {
      console.error("Error generating challenge:", error);
      throw new Error("Failed to generate daily challenge");
    }
  }
}
