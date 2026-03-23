import express from "express";
import students from "./data.json" with {type:"json"};
import fs from "fs";
const app=express();
const port=2000;

app.use(express.json());
app.get("/api/students",(req,res)=>{
    const subject=req.query.subject;
    const sort=req.query.sort;

    const page=Number(req.params.page);
    const limit=Number(req.params.limit);
        
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(students.length / limit);

    const paginatedStudents = students.slice(skip, skip + limit);

    if (page || limit){
        return res.json({
            status:"success",
            pageNum:page,
            limitNum:limit,
            totalPage:totalPages,
            hasNextPage: pageNum<totalPages,
            hasPrevPage: pageNum > 1,
            count:paginatedStudents.length,
            data:paginatedStudents
        })

    }

    
    if(subject){
        const student=students.filter(s=>s.subject==subject);
        return res.json(student);
    }

    if(sort==="mark"){// ascending order
        const student=students.sort((a,b)=>a.marks-b.marks);
        return res.json(student);
    }
    if(sort==="-mark"){// descending order
        const student=students.sort((a,b)=>b.marks-a.marks);
        return res.json(student);
    }

    return res.json(students);
});

app.get("/api/students/:id",(req,res)=>{
    const id=req.params.id;
    const student=students.find(s=>s.id==id);

    if(!student){
        return res.json({
            status:"fail",
            msg:"Student not found!"
        });
    }

    return res.json(student);
});

app.post("/api/students",(req,res)=>{
    const student=req.body;

    students.push({id:students.length+1,...student});
    fs.writeFile("./data.json",JSON.stringify(students),(err)=>{
        return res.json({
            status:"success",
            id:students.length
        });
    });
});

app.patch("/api/students/:id",(req,res)=>{
    const id=req.params.id;
    const student=students.find(s=>s.id==id);

    if(!student){
        return res.json({
            status:"fail",
            msg:"user not exist!"
        });
    }

    Object.assign(student,req.body);
    fs.writeFile("./data.json",JSON.stringify(students),(err)=>{
        return res.json({
            status:"success",
            msg:`user with id ${id} updated successfully`
        });
    })
});

app.delete("/api/students/:id",(req,res)=>{
    const id=req.params.id;
    const index=students.findIndex(s=>s.id==id);

    if(index==-1){
        return res.json({
            status:"fail",
            msg:"student not exist!"
        });
    }

    students.splice(index,1);
    fs.writeFile("./data.json",JSON.stringify(students),(err)=>{
        return res.json({
            status:"success",
            id:index+1
        })
    })
})

app.listen(port,()=>{
    console.log("app is listening on port",port);
})