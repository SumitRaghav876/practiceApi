import express from "express";
import books from "./data.json" with {type:"json"};
import fs from "fs";

const port=2000;
const app=express();

app.use(express.json());
app.get("/api/books",(req,res)=>{
    const {genre,search,available,sort,page,limit}=req.query;

    if(genre){
        const book=books.filter(b=>b.genre===genre);
        if(!book){
            return res.json({
                status:"fail",
                msg:"No book found"
            });
        }
        return res.json(book);
    }

    const isAvailable = available === "true";
    if(available){
        if(available !== "true" && available !== "false"){
            return res.json({
                status:"fail",
                msg:"no book found"
            })
        }
        const book = books.filter(b =>b.available === isAvailable);
        
        return res.json(book);   
    }

    if (search) {
        const book = books.filter(b =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase())
        );
        return res.json(book); 
    }

    if(sort==="price"){
        const book=books.sort((a,b)=>a.price-b.price);
        return res.json(book);
    }
    const m=(page-1)*limit;
    const totalPages= Math.ceil(books.length / limit);
    const paginatedBooks = books.slice(m, m + limit);

    if(page || limit){
        return res.json({
            status:"success",
            pageNum:page,
            limitNum:limit,
            totalPages:totalPages,
            data:paginatedBooks
        })
    }
    return res.json(books);
});

app.get("/api/books/stats",(req,res)=>{
    const totalBooks=books.length;
    const price=books.map(b=>b.price);
    const totalPrice=price.reduce((sum,p)=>sum+p,0);
    const avgPrice=Math.round(totalPrice/totalBooks);
    const maxPrice=Math.max(...price);
    const minPrice=Math.min(...price);

    return res.json({
        status:"success",
        data:{
            totalBooks,
            avgPrice,
            maxPrice,
            minPrice
        }
        
    })

});

app.post("/api/books",(req,res)=>{
    const book=req.body;
    const date=new Date().toISOString().split("T")[0];
    books.push({id:books.length+1, ...book,addedAt:date});

    fs.writeFile("./data.json",JSON.stringify(books),(err)=>{
        return res.json({
            status:"success",
            id:books.length
        })
    });
});

app.delete("/api/books/:id",(req,res)=>{
    const id=req.params.id;
    const index=books.findIndex(b=>b.id==id);
    if(index==-1){
        return res.json({
            status:"fail",
            msg:"NO Book exists!"
        });
    }
    const book=books.splice(index,1);
    fs.writeFile("./data.json",JSON.stringify(books),(err)=>{
        return res.json({
            status:"success",
            data:book
        });
    })
});


app.listen(port,()=>{
    console.log("app is listening on port",port);
});
