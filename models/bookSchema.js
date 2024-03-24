export const schema = {
    collection_name: "book",
    description: "Test book search",
    fields: [
        {
            name: "book_intro",
            description: "",
            data_type: 101,  
            type_params: {
                dim: "2",
            },
            indexName: "sodubey",
        },
        {
            name: "book_id",
            data_type: 5, 
            is_primary_key: true,
            description: "",
        },
        {
            name: "word_count",
            data_type: 5,    
            description: "",
        },
    ],
};
