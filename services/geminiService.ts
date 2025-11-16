import { GoogleGenAI } from "@google/genai";
import { Scenario, ResponseOption } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAIFeedback = async (
  scenario: Scenario,
  playerResponse: ResponseOption
): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("AI Analysis is disabled because the API key is not configured.");
  }

  const prompt = `
    You are an expert supply chain management professor specializing in the SCOR model.
    A student is playing a simulation game. They were presented with the following scenario:
    ---
    Scenario Title: "${scenario.title}"
    Situation: "${scenario.situation}"
    ---
    They chose the following response:
    - Response: "${playerResponse.text}"
    - Impact: ${playerResponse.impact}
    ---
    The general pre-written feedback for this scenario is: "${scenario.feedback}"
    ---
    Based on this information, provide a concise, encouraging, and educational analysis for the student in 2-3 sentences.
    Explain WHY their choice was a strong or weak decision in terms of cost, time, and risk. Relate it back to supply chain best practices.
    Do not repeat the pre-written feedback verbatim. Frame your response as an expert giving personalized advice.
    Start your analysis with "AI Analysis:".
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching AI feedback:", error);
    return "AI Analysis: Could not retrieve AI feedback at this time.";
  }
};
