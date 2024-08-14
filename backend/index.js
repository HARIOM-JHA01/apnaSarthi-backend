import express from "express";
import 'dotenv/config'
import mongoose from "mongoose"
import cors from "cors"
import bcrypt from "bcrypt"
import User from "./models/user.js"
const app = express();
app.use(cors())
app.use(express.json())
app.get("/", (req, res)=>{
    res.send("Hello from root")
})


async function main() {
    await mongoose.connect("mongodb+srv://apnasarthitech:gMDH7mcTvDfyAzpZ@apnasarthi.ayh0c.mongodb.net/");
  }


main()
  .then(() => {
    console.log("dbs Connecting");
  })
  .catch((err) => console.log(err));
    app.post("/signup", (req, res) => {
        const { username, email, password, phone } = req.body;
        User.findOne({ email: email })
            .then(existingUser => {
                if (existingUser) {
                    res.status(400).json({ message: "User already exists" });
                } else {
                    const user = new User({ username, email, password, phone });
                       user.save()
                        .then(data => {
                            res.json(data);
                        })
                        .catch(err => {
                            res.status(500).json({ message: "Error saving user", error: err });
                        });
                }
            })
            .catch(err => {
                res.status(500).json({ message: "Error checking existing user", error: err });
            });
    });

    app.post("/login", (req, res) => {
        const { email, password } = req.body;
        User.findOne({ email: email })
          .then(user => {
            if (!user) {
              return res.status(400).json({ message: "Invalid email or password" });
            }
           bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                return res.status(500).json({ message: "Error while comparing passwords", error: err });
              }
              
              if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password" });
              }
             res.json({ message: "Login successful", user: user });
            });
          })
          .catch(err => {
            res.status(500).json({ message: "Error finding user", error: err });
          });
      });
   


const port = process.env.PORT || 8080;
app.listen(port, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`)
})


