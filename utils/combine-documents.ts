import { DocumentInterface } from "@langchain/core/documents";

export const combineDocuments = (
  docs: DocumentInterface<Record<string, any>>[]
) => docs.map((e) => e.pageContent).join("\n\n");
