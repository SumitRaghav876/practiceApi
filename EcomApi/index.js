import express from "express";
import products from "./data.json" with {type:"json"};
import fs from "fs";
const app=express();
const port=2000;

app.use(express.json());
app.get("/api/product",(req,res)=>{
    const {category,brand,search,sort,page,limit,minPrice,maxPrice}=req.query;
    if(category){
        const product=products.filter(p=>p.category===category);
        if(!product){
            return res.json({
                status:"fail",
                msg:"no product found"
            });
        }
        return res.json(product);
    }

    if(brand){
        const product=products.filter(p=>p.brand.toLowerCase()===brand.toLowerCase());
        if(!product){
            return res.json({
                status:"fail",
                msg:"no product found"
            });
        }
        return res.json(product);
    }

    if(search){
        const product=products.filter(p=>p.name.toLowerCase()===search.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase()===search.toLowerCase().includes(search.toLowerCase()) );
        if(product.length===0){
            return res.json({
                status:"fail",
                msg:"no product found"
            });
        }
        return res.json(product);
    }

    if(sort){
        if(sort==="price"){
            const product=products.sort((a,b)=>a.price-b.price);
            return res.json(product);
        }
        if(sort==="rating"){
            const product=products.sort((a,b)=>a.rating-b.rating);
            return res.json(product);
        }
    }

    const totalProducts=products.length;
    const print=(page-1)*limit;
    const totalPages=Math.ceil(totalProducts/limit);
    const paginatedProducts=products.slice(print,print+limit);
    if(page || limit){
        return res.json({
            status:"success",
            pageNum:page,
            limitNum:limit,
            totalPages:totalPages,
            data:paginatedProducts
        })
    }

    if(minPrice || maxPrice){
        const product=products.filter(
            (p)=>{ 
                if(p.price>=minPrice && p.price<=maxPrice){
                    return p;
                }
            }   
        );
        if(product.length===0){
            return res.json({
                status:"fail",
                msg:"Product Not found!"
            });
        }
        return res.json(product);
    }
    
    return res.json(products);
});

app.get("/api/products/stats",(req,res)=>{
    const total=products.length;
    const price=products.map(a=>a.price);

    const totalPrice=price.reduce((sum,p)=>sum+p,0);
    const avgPrice=Math.round(totalPrice/total);
    
    const rating=products.map(a=>a.rating);
    const totalRating=rating.reduce((ratings,p)=>ratings+p,0);

    const avgRating=Math.round(totalRating/total);
    const highestRated=Math.max(...rating);

    const stock=products.map(p=>p.stock);
    const maxStocked=Math.max(...stock);

    return res.json({
        total:total,
        avgPrice:avgPrice,
        avgRating:avgRating,
        highestRated:highestRated,
        mostStoked:maxStocked
    })
});

app.post("/api/products",(req,res)=>{
    const product=req.body;
    const createdAt=new Date().toISOString().split("T")[0];
    products.push({id:products.length+1, ...product, createdAt:createdAt });

    fs.writeFile("./data.json",JSON.stringify(products),(err)=>{
        return res.json({
            status:"success",
            id:products.length
        });
    })
});

app.delete("/api/products/:id",(req,res)=>{
    const id=req.params.id;
    const index=products.findIndex(p=>p.id==id);
    if(index==-1){
        return res.json({
            status:"fail",
            msg:"product not found"
        });
    }

    products.splice(index,1);
    fs.writeFile("./data.json",JSON.stringify(products),(err)=>{
        return res.json({
            status:"success",
            id:products.length+1
        })
    })
});

app.patch("/api/products/:id",(req,res)=>{
    const id=req.params.id;
    const stock=req.body;
    const product=products.find(p=>p.id==id);
    if(!product){
        return res.json({
            status:"fail",
            msg:"Product not found!"
        });
    }
    if (stock === undefined) {
        return res.json({
            status: "fail",
            msg: "stock value is required!"
        });
    }
    product.stock = stock;
    fs.writeFile("./data.json",JSON.stringify(products),(err)=>{
        return res.json({
            status:"success",
            msg:"Product updated successfully"
        })
    });


})

app.listen(port,()=>{
    console.log("app is listening on port",port);
})