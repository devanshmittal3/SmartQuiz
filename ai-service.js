// SmartQuiz AI Service - OpenRouter implementation
const OPENROUTER_API_KEY = "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";

/**
 * Direct fetch call to OpenRouter API
 */
async function callAI(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300
    })
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || "API Error");
  }

  if (data.choices && data.choices[0].message) {
    return data.choices[0].message.content;
  }

  return "I'm sorry, I couldn't generate a response right now.";
}

/**
 * Fetch a concise explanation for a quiz question.
 */
export async function getAnswerExplanation(questionText, correctAnswer, userSelectedAnswer) {
  const prompt = `
    Expert tutor task:
    Question: "${questionText}"
    Correct answer: "${correctAnswer}"
    User chose: "${userSelectedAnswer}"
    Explain why the correct answer is right in 2 sentences. 
  `;

  try {
    return await callAI(prompt);
  } catch (error) {
    console.error("Explanation AI Error:", error);
    return "Tutoring AI is taking a break. Try again in a minute!";
  }
}

/**
 * Analyze user's quiz history to find weaknesses.
 */
export async function analyzeLearningWeaknesses(attempts) {
  if (!attempts || attempts.length === 0) return "No history found. Take a quiz first!";

  const historySummary = attempts.slice(0, 10).map(a =>
    `- Subject: ${a.domain}, Topic: ${a.topic}, Score: ${a.percentage}%`
  ).join("\n");

  const prompt = `
    Learning Counselor task:
    Based on this history:
    ${historySummary}
    
    Identify: 1. Main Strength, 2. Weakest Area, 3. One Study Tip.
    Use bullet points and keep it short.
  `;

  try {
    return await callAI(prompt);
  } catch (error) {
    console.error("Analysis AI Error:", error);
    return "Analysis AI is currently unavailable. Please try again later!";
  }
}
