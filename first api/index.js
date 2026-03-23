import express from "express";
import users from "../data.json" with { type: 'json' };
import fs from "fs";
const app=express();
const port=8080;

app.use(express.json());

app.get("/users",(req,res)=>{
    const html=`
    <ul>
        ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})

app.get("/api/users",(req,res)=>{
    return res.json(users);
})

app.route("/api/users/:id")
.get((req,res)=>{
    const id=Number(req.params.id);
    const user=users.find((user)=>user.id===id);
    return res.json(user);
})
.patch((req,res)=>{
   const id=Number(req.params.id);
   const user=users.find((u)=>u.id===id);

    if (!user) return res.status(404).json({ 
        status: "fail", 
        message: "User not found" 
    });

    Object.assign(user,req.body);
    fs.writeFile("./data.json",JSON.stringify(users),(err)=>{
        return res.json({
            status:"success",
            data:user
        });
    })
})
.delete((req,res)=>{
    const id=Number(req.params.id);
    const index=users.findIndex((u)=>u.id===id);

    if (index===-1) return res.status(404).json({ 
        status: "fail", 
        message: "User not found" 
    })

    users.splice(index,1);

    fs.writeFile('./data.json', JSON.stringify(users), (err) => {
        return res.json({ 
            status: "success", 
            msg: "User deleted successfully"
        })
    });
});

app.post("/api/users",(req,res)=>{
    const body=req.body;
    users.push({id:users.length+1,...body});

    fs.writeFile("./data.json",JSON.stringify(users),(err,data)=>{
        return res.json({
            status:"success",
            id:users.length
        });
    });
})

app.listen(port,()=>{
    console.log("app is listening on port",port);
})