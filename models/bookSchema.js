export const schema = {
    collection_name: "article",
    description: "article data search",
    fields: [
        {
            name: "id",
            data_type: 5, 
            is_primary_key: true,
            description: "",
        },
        {
            name: "vector",
            description: "",
            data_type: 101,  
            type_params: {
                dim: "1536",
            },
            indexName: "sodubey",
        },
        {
            name: "content",
            data_type: "VarChar",    
            description: "",
            max_length: 1000
        },
    ],
};
