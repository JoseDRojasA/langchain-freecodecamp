import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { environment } from "../environment";

const openAiEmbeddings = new OpenAIEmbeddings({
  openAIApiKey: environment.OPENAI_API_KEY,
});

const supabaseClient = createClient(
  environment.SUPABASE_URL,
  environment.SUPABASE_PRIVATE_KEY
);

export const vectorStore = () =>
  new SupabaseVectorStore(openAiEmbeddings, {
    client: supabaseClient,
    tableName: environment.SUPABASE_DOCUMENTS_TABLE_NAME,
    queryName: "match_documents",
  });
