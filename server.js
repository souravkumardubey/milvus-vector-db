import { MilvusClient } from "@zilliz/milvus2-sdk-node";
import { schema } from "./models/bookSchema.js";

const milvusClient = new MilvusClient("localhost:19530");

const data = Array.from({ length: 2000 }, (v,k) => ({
    "book_id": k,
    "book_intro": Array.from({ length: 2 }, () => Math.random()),
    "word_count": k+10000,
}));
  
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
    //     collection_name: 'book',
    //     index_name:'index',
    //     field_name: 'book_intro',
    //     extra_params: {
    //         "index_type": "IVF_FLAT",
    //         "metric_type": "L2",
    //         "params": "{\"nlist\":\"16384\"}"
    //     },
    // });
      
    // ------------------- insert data into collection ------------------------------
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