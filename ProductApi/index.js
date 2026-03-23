import express from "express";
import products from "./data.json" with {type:"json"};
import fs from "fs";
const app=express();
const PORT=5000;

app.use(express.json());


app.get("/api/products/:id",(req,res)=>{
    const id=Number(req.params.id);
    const product=products.find((p)=>p.id===id);

    if(!product){
        return res.json({
            status:"fail",
            msg:"Not found!"
        });
    }

    return res.json(product);
});

app.get("/api/products", (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.json(products);
  }

  const product = products.filter((p) =>
    p.category.toLowerCase() === category.toLowerCase()
  );

  if (product.length === 0) {
    return res.status(404).json({ 
      status: "fail", 
      msg: "Product not exists!" 
    });
  }

  return res.json(product);
});

app.post("/api/products",(req,res)=>{
  const product=req.body;
  products.push({id:products.length+1, ...product});

  fs.writeFile("./data.json",JSON.stringify(products),(err)=>{
    return res.json({
      status:"success",
      id:products.length,
    });
  })
});

app.patch("/api/products/:id",(req,res)=>{
  const id=Number(req.params.id);
  const product=products.find((p)=>p.id===id);
  if(!product){
    return res.json({
      status:"fail",
      msg:"product not found!"
    });
  }

  Object.assign(product,req.body);
  fs.writeFile("./data.json",JSON.stringify(products),(err)=>{
    return res.json({
      status:"success",
      data:product
    });
  })

});

app.delete("/api/products/:id",(req,res)=>{
  const id=Number(req.params.id);
  const index=products.findIndex((p)=>p.id===id);

  if(index===-1){
    return res.json({
      status:"fail",
      msg:"Product does not exists!"
    });
  }

  products.splice(index,1);
  fs.writeFile("./data.json",JSON.stringify(products),(err)=>{
    return res.json({
      status:"success",
      msg:"Product deleted successfully :)"
    });
  })

})

app.listen(PORT,()=>{
    console.log("app is listening on port",PORT);
});