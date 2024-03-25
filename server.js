import { MilvusClient } from "@zilliz/milvus2-sdk-node";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as dotenv from "dotenv";
import { schema } from "./models/bookSchema.js";

dotenv.config();

const milvusClient = new MilvusClient("localhost:19530");

const loader = new DirectoryLoader("./documents", {
  ".txt": (path) => new TextLoader(path),
  ".pdf": (path) => new PDFLoader(path),
});

const docs = await loader.load();

const insertData = async () => {

  for (const doc of docs) {

    console.log("1")
    
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;
    
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
    });
    
    const chunks = await textSplitter.createDocuments([text]);
    
    const result = chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "));
    const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
      result
    );
    console.log("2")

    console.log(embeddingsArrays)
    const data = [];

    for (let idx = 0; idx < chunks.length; i++) {

      const chunk = chunks[idx];
      const vector = {
        "id": `${idx}`,
        "vector": embeddingsArrays[idx],
        "content": chunk.pageContent
      }

      data.push(vector);

    }

    await milvusClient.insert({
        collection_name: "article",
        fields_data: data,
    });

  }
}
// const data = Array.from({ length: 2000 }, (v, k) => ({
//   "book_id": k,
//   "book_intro": Array.from({ length: 2 }, () => Math.random()),
//   "word_count": k+10000,
// }));
  
const indexParams = {
  indexType: "IVFLAT", 
  nlist: 16384,
};

const searchParams = {
  anns_field: "book_intro",
  topk: "2",
  metric_type: "L2",
  params: JSON.stringify({ nprobe: 10 }),
};

const releaseCollections = async () => {
  await milvusClient.releaseCollection({  collection_name: "book",});
}
  
const main = async () => {
  try {
    // --------------------- create collection
    // await milvusClient.createCollection(schema);

    // ------------------------- show collections 
    /* 
    const collections = await milvusClient.showCollections();
    console.log("List all collections:\n", collections);
    */

    // ---------------------- creating index ----------------
    // await milvusClient.createIndex({
    //     collection_name: 'article',
    //     index_name:'index',
    //     field_name: 'vector',
    //     extra_params: {
    //         "index_type": "IVF_FLAT",
    //         "metric_type": "L2",
    //         "params": "{\"nlist\":\"16384\"}"
    //     },
    // });
      
    // ------------------- insert data into collection ------------------------------
    insertData();
    // const res = await milvusClient.insert({
    //     collection_name: "book",
    //     fields_data: data,
    // });

    // ----------------- vector search -----------------------------------
    // const results = await milvusClient.search({
    //     collection_name: "book",
    //     expr: "",
    //     vectors: [[0.1, 0.2]],
    //     search_params: searchParams,
    //     vector_type: 101,
    // });

    // console.log(results.results)

  } catch (error) {
    console.error(error);
  }
}

main();