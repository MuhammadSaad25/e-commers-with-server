//sir inzamam api
import express from "express";
import path from "path";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let products = []; // TODO: connect with mongodb instead

app.post("/product", (req, res) => {
  const body = req.body;
  const Id = uuidv4();
  const productId = { ...body, id: Id };

  if (!body.name || !body.price || !body.description) {
    res.status(400).send({ message: "required parameters missing" });
    return;
  }
  console.log(body.name);
  console.log(body.price);
  console.log(body.description);

  products.push(
    // id: new Date().getTime(),
    // name: body.name,
    // price: body.price,
    // description: body.description,
    productId
  );
  res.send({ message: "product added successfully" });
});

app.get("/products", (req, res) => {
  res.send({
    message: "got all products successfully",
    data: products,
  });
});
console.log(products[0]);

app.get("/products/:id", (req, res) => {
  const id = req.params.id;

  const foundProduct = products.find((body) => body.id == id);
  res.send(foundProduct);
});

app.delete("/products/:id", (req, res) => {
  const id = req.params.id;

  products = products.filter((body) => body.id != id);

  res.send(`user with id ${id}`);
});

app.put("/products/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;

  if (!body.name || !body.price || !body.description) {
    res.status(400).send({ message: "required parameters missing" });
    return;
  }

  console.log(body.name);
  console.log(body.price);
  console.log(body.description);

  let isFound = false;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      products[i].name = body.name;
      products[i].price = body.price;
      products[i].description = body.description;
      res.send({ message: "product modified successfully" });
      isFound = true;
      break;
    }
  }
  if (!isFound) {
    res.status(404);
    res.send({ message: "edit fail: product not found" });
  }
  res.send({ message: "product added successfully" });
});





// app.patch("/products/:id", (req, res) => {
//   const id = req.params.id;
//   const body = req.body;

//   const products = products.filter((body) => body.id != id);

//   if (body.name) products.name = body.name;
//   if (body.price) products.price = body.price;
//   if (body.description) products.description = body.description;

//   res.send(`user with id ${id} has ben changed`);
// });

// app.get("/product/:id", (req, res) => {
//   const id = req.params.id;
//   let isFound = false;
//   for (let i = 0; i < products.length; i++) {
//     if (products[i].id === id) {
//       res.send({
//         message: `get product by id: ${products[i].id} success`,
//         data: products[i],
//       });

//       isFound = true;
//       break;
//     }
//   }
//   if (isFound === false) {
//     res.status(404);
//     res.send({ message: "product not found" });
//   }
//   return;
// });

// app.delete("/product/:id", (req, res) => {
//   const id = req.params.id;

//   let isFound = false;
//   for (let i = 0; i < products.length; i++) {
//     if (products[i].id === id) {
//       products.splice(i, 1);
//       res.send({ message: "product deleted successfully" });
//       isFound = true;
//       break;
//     }
//   }
//   if (isFound === false) {
//     res.status(404);
//     res.send({ message: "delete fail: product not found" });
//   }
// });


const __dirname = path.resolve();
app.use("/", express.static(path.join(__dirname, "./web/build")));
app.use("*", express.static(path.join(__dirname, "./web/build")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
