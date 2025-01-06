import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { environment } from "../../environment";
import { generateDocumentSplit } from "./generate-document-split";
export const loadVectorEmbeddings = async () => {
  try {
    const documentSplit = await generateDocumentSplit();

    const supabaseClient = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_PRIVATE_KEY
    );

    const openAiEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: environment.OPENAI_API_KEY,
    });
    await SupabaseVectorStore.fromDocuments(documentSplit, openAiEmbeddings, {
      client: supabaseClient,
      tableName: environment.SUPABASE_DOCUMENTS_TABLE_NAME,
    });

    console.log("SUCCESS");
  } catch (e) {
    console.error(e);
  }
};
