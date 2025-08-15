import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// ✅ Initialize Gemini with OpenAI-compatible client
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
});



// Example starting messages
const messages = [
  { role: "system", content: "Extract the event and follow the START→THINK→OUTPUT steps." },
  { role: "user", content: "John and Susan are going to an AI conference on Friday" }
];

async function run() {
  while (true) {
    const response = await openai.chat.completions.parse({
      model: "gemini-1.5-flash",
      messages,
      response_format: zodResponseFormat(CalendarEvent, "event")
    });

   

    // Store back into messages for next loop turn
    messages.push({
      role: "assistant",
      content: JSON.stringify(parsedContent)
    });

    // Logic branching
    if (parsedContent.step === "START") {
      console.log(`🔥`, parsedContent.content);
      continue;
    }

    if (parsedContent.step === "THINK") {
      console.log(`\t🧠`, parsedContent.content);

      messages.push({
        role: "developer",
        content: JSON.stringify({
          step: "EVALUATE",
          content: "Nice, You are going on correct path"
        })
      });

      continue;
    }

    if (parsedContent.step === "OUTPUT") {
      console.log(`🤖`, parsedContent.content);
      break; // ✅ Exit loop
    }
  }

  console.log("Done...");
}

run();
