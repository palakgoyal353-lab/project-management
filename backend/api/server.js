// import express from 'express'
// import 'dotenv/config'
// import cors from 'cors'
// import { clerkMiddleware } from '@clerk/express'
// import { serve } from "inngest/express";
// import { inngest, functions } from "../inngest/index.js"

// const app = express();

// app.use(express.json());
// app.use(cors())
// app.use(clerkMiddleware());

// const PORT = process.env.PORT || 3000


// app.get("/", (req, res) => {
//   console.log("Server is working ✅");
// });

// app.get("/test-db", async (req, res) => {
//   try {
//     const users = await prisma.user.findMany();
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error.message);
//   }
// });

// app.get('/', (req, res)=> res.send('server is live !'));
// app.use("/api/inngest", serve({ client: inngest, functions }));


// export default app;




import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/mohan", (req, res) => {
  res.send("Server is live ✅");
});

export default app;