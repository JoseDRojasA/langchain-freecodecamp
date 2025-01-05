import { ChatOpenAI } from "@langchain/openai";
// import { createInterface } from "node:readline/promises";
import { PromptTemplate } from "@langchain/core/prompts";
import { environment } from "../../environment";

import { MAX_INTERACTIONS } from "./constants";

export const runChatbot = async () => {
  let interaction = 0;
  /*const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  */
  let output = `system: `;
  const llm = new ChatOpenAI({ apiKey: environment.OPENAI_API_KEY });

  const standaloneQuestionTemplateFormat = `Turn this question in a standalone question: {question}`;

  const standaloneQuestionTemplate = PromptTemplate.fromTemplate(
    standaloneQuestionTemplateFormat
  );

  const chain = standaloneQuestionTemplate.pipe(llm);

  const response = await chain.invoke({
    question:
      "My name is Jose and I'm 27 years. I like to go outside with my friends and my girlfriend. I would like to know what's the name of the president of united states. This is important because my girlfriend would like to go there",
  });

  console.log(response.content);
  /*
  while (interaction < MAX_INTERACTIONS && 1 > 2) {
    interaction++;
    const questions = readline.question(output);
  }*/
};
