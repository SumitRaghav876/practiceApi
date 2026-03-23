import express from "express";
import notes from "./data.json" with {type:"json"};
import fs from "fs";
const app=express();
const port=2000;

app.use(express.json());
app.get("/api/notes",(req,res)=>{
    const tag=req.query.tag;
    const title=req.query.search;
    const note=notes.filter(n=>n.tag==tag);
    const output=notes.filter(n=>n.title==title || n.content==title);
    if(tag){
        return res.json(note);
    }
    if(title){
        return res.json(output);
    }
    return res.json(notes);
});

app.get("/api/notes/:id",(req,res)=>{
    const id=Number(req.params.id);
    const note=notes.find(n=>n.id==id);

    if(!note){
        return res.json({
            status:"fail",
            msg:"Notes Not Found!"
        })
    }

    return res.json(note);
});

app.post("/api/notes",(req,res)=>{
    const newNotes=req.body;

    notes.push({id:notes.length+1,...newNotes,createdAt:new Date().toISOString().split("T")[0]});
    fs.writeFile("./data/json",JSON.stringify(notes),(err)=>{
        return res.json({
            status:"success",
            id:notes.length,
            msg:"Notes added successfully!"
        });
    })
});

app.patch("/api/notes/:id",(req,res)=>{
    const id=req.params.id;
    const update=req.body;
    const note=notes.find(n=>n.id==id);

    if(!note){
        return res.json({
            status:"fail",
            status:"success"
        })
    }

    Object.assign(note,update);
    fs.writeFile("./data.json",JSON.stringify(notes),(err)=>{
        return res.json({
            status:"success",
            msg:`notes of ${id} updated successfully`
        });
    })
    
});

app.delete("/api/notes/:id",(req,res)=>{
    const id=req.params.id;
    const index=notes.findIndex(n=>n.id==id);

    if(index==-1){
        return res.json({
            status:"fail",
            msg:"notes not found!"
        });
    }

    notes.splice(index,1);
    fs.writeFile("./data.json",JSON.stringify(notes),(err)=>{
        return res.json({
            status:"success",
            msg:"notes updated successfully!"
        });
    });
})

app.listen(port,()=>{
    console.log("app is listening on port",port);
});