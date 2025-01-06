import { ChatOpenAI } from "@langchain/openai";
// import { createInterface } from "node:readline/promises";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { environment } from "../../environment";
import { combineDocuments } from "../../utils/combine-documents";
import { vectorStore } from "../../utils/vector-store";

export const runChatbot = async () => {
  let interaction = 0;
  /*const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  */

  const retriever = vectorStore().asRetriever();
  const llm = new ChatOpenAI({ apiKey: environment.OPENAI_API_KEY });

  const standaloneQuestionTemplate = PromptTemplate.fromTemplate(
    `Turn this question in a standalone question: {question}`
  );

  const responseTemplate =
    PromptTemplate.fromTemplate(`You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
question: {question}
answer: `);

  const standaloneQuestionChain = standaloneQuestionTemplate
    .pipe(llm)
    .pipe(new StringOutputParser());

  const contextChain = standaloneQuestionChain
    .pipe(retriever)
    .pipe(combineDocuments);
  const responseChain = responseTemplate
    .pipe(llm)
    .pipe(new StringOutputParser());

  const chain = RunnableSequence.from([
    {
      context: contextChain,
      originalInput: new RunnablePassthrough(),
    },
    {
      context: ({ context }) => context,
      question: ({ originalInput }) => originalInput.question,
    },
    responseChain,
  ]);

  const response = await chain.invoke({
    question:
      "What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.",
  });

  console.log(response);
  /*
  while (interaction < MAX_INTERACTIONS && 1 > 2) {
    interaction++;
    const questions = readline.question(output);
  }*/
};
