const express = require("express");
// const session = require("express-session");
const session = require("cookie-session");
// const passport = require("passport");
// const LocalStategy = require("passport-local").Strategy;
// const bcypt = require("bcryptjs");
const cors = require("cors");

// const prisma = require("./prisma");
const routes = require("./routes/index");

// NEON TEST
const postgres = require('postgres');
require('dotenv').config();
// NEON TEST

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "cat",
    resave: false,
    saveUninitialized: false,
  }),
);
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(
//   new LocalStategy(async (username, password, done) => {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { username: username },
//       });
//       if (!user) {
//         return done(null, false, { message: "Incorrect username" });
//       }
//       const passwordMatch = await bcypt.compare(password, user.password);
//       if (!passwordMatch) {
//         return done(null, false, { message: "Incorrect password" });
//       }
//       return done(null, user);
//     } catch (error) {
//       return done(error);
//     }
//   }),
// );
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id: user.id } });
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });



// NEON TEST
let { HOST, DBNAME, USER, DBPASS, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: HOST,
  database: DBNAME,
  username: USER,
  password: DBPASS,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  // const result = await sql`select version()`;
  const result = await sql;
  console.log(result);
}

getPgVersion();
// NEON TEST

app.use("/users", routes.users);
app.use("/posts", routes.posts);
app.use("/comments", routes.comments);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
