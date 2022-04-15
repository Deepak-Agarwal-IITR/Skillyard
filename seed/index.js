const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Community = require("../models/community");
const Post = require("../models/post");
const User = require("../models/user");

mongoose.connect("mongodb://localhost:27017/skillyard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Community.deleteMany({});
  console.log("Deleted communities");
  await User.deleteMany({});
  console.log("Deleted users");
  await Post.deleteMany({});
  console.log("Deleted posts");
  await Comment.deleteMany({});
  console.log("Deleted comments");

  const user1 = new User({ username: "Rachel", enrollmentNo: 20114037 });
  const registeredUser1 = await User.register(user1, "rachel");
  const user2 = new User({ username: "Ross", enrollmentNo: 20114038 });
  const registeredUser2 = await User.register(user2, "ross");
  const user3 = new User({ username: "Monica", enrollmentNo: 20114039 });
  const registeredUser3 = await User.register(user3, "monica");
  const user4 = new User({ username: "Chandler", enrollmentNo: 20114040 });
  const registeredUser4 = await User.register(user4, "chandler");

  const comment1 = new Comment({
    text: "It is because of .....",
    author: user2._id,
    likedby: [user1._id, user3._id, user4._id],
  });
  const comment2 = new Comment({
    text: "Yes.. I agree, Also we should consider the advantages of ...",
    author: user3._id,
    likedby: [user1._id],
  });
  const comment3 = new Comment({
    text: "According to me, following ijk SDLC model should be most beneficial because of ...",
    author: user4._id,
    likedby: [user1._id, user3._id, user2._id],
  });
  const comment4 = new Comment({
    text: "Okay, thankyou!",
    author: user2._id,
    likedby: [user4._id],
  });

  //   const community2 = new Community({
  //     name: "Blockchain",
  //     owner: user1._id,
  //     posts: [post3._id, post4._id],
  //     members: [user1._id, user2._id],
  //   });
  //   const community3 = new Community({
  //     name: "Web Development",
  //     owner: user1._id,
  //     posts: [post5._id, post6._id],
  //     members: [user1._id, user2._id, user3._id, user4._id],
  //   });

  const post1 = new Post({
    topic: "SDLC",
    description:
      "Why do we need to implement Waterfall model of SDLC in making xyz project?",
    // community: community1._id,
    author: user1._id,
    comments: [comment1._id, comment2._id],
    likedby: [user2._id, user3._id],
  });
  const post2 = new Post({
    topic: "SDLC",
    description: "Which model of SDLC do I follow fro abc project?",
    // community: community1._id,
    author: user2._id,
    comments: [comment3._id],
    likedby: [user1._id, user3._id, user4._id],
  });

  const community1 = new Community({
    name: "Software Engineering",
    owner: user1._id,
    posts: [post1._id, post2._id],
    members: [user1._id, user2._id, user3._id, user4._id],
  });
};

seedDB().then(() => {
  mongoose.connection.close();
});
