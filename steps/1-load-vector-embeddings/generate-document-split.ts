import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { readFile } from "node:fs/promises";

export const generateDocumentSplit = async () => {
  const result = await readFile("scrimba-info.txt");
  const text = await result.toString("utf-8");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  return splitter.createDocuments([text]);
};
