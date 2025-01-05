import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://standardwebtechnologies:Promise%402020@cluster0.evei3.mongodb.net/food-del', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("DB Connected");
  }).catch((error) => {
    console.error("DB Connection Error:", error);
  });
};
