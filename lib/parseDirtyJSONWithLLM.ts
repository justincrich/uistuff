import OpenAI from "openai";

export async function parseDirtyJSONWithLLM(dirtyJson: string) {
  // Initialize the OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Prompt for OpenAI to parse the JSON
  const prompt = `Parse the following text into valid JSON. Remove any markdown formatting or newlines that aren't part of the JSON structure:\n\n${dirtyJson}`;

  // Call OpenAI API
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview", // or another suitable model
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that parses dirty JSON into clean, valid JSON. Return only the parsed JSON without any additional text. Deeply parse all nested JSON objects and arrays. Fix any syntax errors in the JSON or commentary and resonably translate the data into valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0,
  });

  // Extract and parse the cleaned JSON from the response
  const cleanedJson = response.choices[0]?.message.content?.trim();
  return JSON.parse(cleanedJson || "{}");
}
