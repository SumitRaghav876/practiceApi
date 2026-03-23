import express from "express";
import books from "./data.json" with {type:"json"};
import fs from "fs";

const app=express();
const PORT=4000;

app.use(express.json());
app.get("/",(req,res)=>{
    res.send("working fine :)");
});

//get all books
app.get("/api/books",(req,res)=>{
    return res.json(books); 
});

//get book by id
app.get("/api/books/:id",(req,res)=>{
    const id=Number(req.params.id);
    const book=books.find(b=>b.id===id);

    return res.json(book);

});

//add new book
app.post("/api/books",(req,res)=>{
    const book=req.body;
    books.push({id:books.length+1,...book})
    fs.writeFile("./data.json",JSON.stringify(books),(err)=>{
        return res.json({
            status:"success",
            id:books.length
        });
    })
});

//Update a book
app.patch("/api/books/:id",(req,res)=>{
    const id=Number(req.params.id);
    const book=books.find((b)=>b.id===id);
    if(!book){
        return res.json({
            status:"fail",
            msg:"BOOK NOT FOUND!"
        });
    }

    Object.assign(book,req.body);
    fs.writeFile("./data.json",JSON.stringify(books),(err)=>{
        return res.json({
            status:"success",
            data:book});
    });
});

//delete a book
app.delete("/api/books/:id",(req,res)=>{
    const id=Number(req.params.id);
    const index=books.findIndex((b)=>b.id===id);

    if(index===-1){
        return res.status(404).json({
            status:"fail",
            msg:"BOOK NOT FOUND"
        });
    }

    books.splice(index,1);

    fs.writeFile("./data.json",JSON.stringify(books),(err)=>{
        return res.json({
            status:"success",
            msg:"Book deleted successfully!"
        });
    });
});

app.listen(PORT,()=>{
    console.log("app is listening on port",PORT);
})