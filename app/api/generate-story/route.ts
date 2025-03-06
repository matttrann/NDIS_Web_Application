import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { questionnaireData } = await req.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a therapeutic story for an NDIS patient based on these questionnaire responses: ${JSON.stringify(questionnaireData)}. 

ROLE: You are an experienced social worker specialising in therapeutic storytelling.

STORY REQUIREMENTS:
- Length: Approximately 500-800 words
- Target audience: NDIS participants
- Theme: Personal growth and skill development

STRUCTURE:
1. Begin with a relatable situation or challenge
2. Introduce coping strategies naturally through the narrative
3. Show positive outcomes from using these strategies
4. End with hope and practical takeaways

STYLE GUIDELINES:
- Use gentle, supportive language
- Keep a grounded, realistic perspective
- Avoid clinical or technical terms
- Use first-person perspective consistently
- Include sensory details to make the story engaging
- Incorporate the patient's interests and preferences from the questionnaire

TONE:
- Encouraging but not patronizing
- Authentic and relatable
- Emotionally sensitive
- Culturally appropriate for Australian context

FORMAT:
- No subheadings or sections
- Clear paragraph breaks
- Natural dialogue (if any)
- Proper sentence structure with normal spacing
- Use Australian English spelling and expressions

IMPORTANT: 
- Use Australian English spelling and expressions
- Ensure the story directly relates to the questionnaire responses
- Focus on building practical life skills
- Include specific coping strategies mentioned in the questionnaire
- Maintain a positive but realistic narrative arc`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // For cleanin up the response text because sometimes wording is weird/spacing of it
    const cleanText = response.text()
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();
    
    return NextResponse.json({ text: cleanText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
}