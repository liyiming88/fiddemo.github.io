import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FinancialProfile } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-ui-demo' });
};

export const generateFinancialAdvice = async (
  profile: FinancialProfile,
  query: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Construct a context-aware system instruction
    const systemInstruction = `You are a senior financial planner at a top-tier firm like Fidelity. 
    You are helpful, conservative, and professional. 
    The user's profile is:
    - Age: ${profile.currentAge}
    - Retirement Age: ${profile.retirementAge}
    - Current Savings: $${profile.currentSavings.toLocaleString()}
    - Annual Contribution: $${profile.annualContribution.toLocaleString()}
    - Risk Tolerance: ${profile.riskTolerance}
    
    Provide concise, actionable advice based on this profile. 
    Do not provide specific legal or tax advice, but general financial guidance.
    Format your response with clear paragraphs or bullet points.`;

    const model = 'gemini-2.5-flash';

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result: GenerateContentResponse = await chat.sendMessage({
      message: query
    });

    return result.text || "I apologize, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the financial planning server. Please check your API key or try again later.";
  }
};

export const analyzePortfolioHealth = async (profile: FinancialProfile): Promise<string> => {
   try {
    const ai = getClient();
    const prompt = `Analyze my current financial health based on my profile:
    Age: ${profile.currentAge}, Savings: ${profile.currentSavings}, Annual Contrib: ${profile.annualContribution}, Risk: ${profile.riskTolerance}.
    Am I on track for a comfortable retirement if I retire at ${profile.retirementAge}? Give me a quick status update (On Track, Needs Attention, or At Risk) and 3 bullet points of advice.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Analysis unavailable.";
   } catch (error) {
     console.error("Analysis Error:", error);
     return "System offline.";
   }
}
