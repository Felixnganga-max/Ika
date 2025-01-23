import pizzaImage from "../assets/pizza.avif";
import teaImage from "../assets/tea.jpg";
import burgerImage from "../assets/burger.jpg";
import samosaImage from "../assets/samosa.jpg";
import pinneapleImage from "../assets/pineapple.jpg";
import chipsImage from "../assets/chips.jpg";

export const foods = [
  {
    id: 1,
    name: "Pizza",
    price: 600,
    category: "Food",
    keyIngredients: ["Ingredient1", "Ingredient2", "Ingredient3"],
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi cupiditate possimus qui ad ratione doloribus dolor est id reiciendis maiores",
    image: pizzaImage,
  },
  {
    id: 2,
    name: "Tea",
    price: 30,
    category: "Beverages",
    keyIngredients: ["Ingredient1", "Ingredient2", "Ingredient3"],
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi cupiditate possimus qui ad ratione doloribus dolor est id reiciendis maiores",
    image: teaImage,
  },
  {
    id: 3,
    name: "Cheeseburger",
    price: 10.99,
    category: "Fast",
    keyIngredients: ["Ingredient1", "Ingredient2", "Ingredient3"],
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi cupiditate possimus qui ad ratione doloribus dolor est id reiciendis maiores",
    image: burgerImage,
  },
  {
    id: 4,
    name: "Samosa",
    price: 25,
    category: "Wheat",
    keyIngredients: ["Ingredient1", "Ingredient2", "Ingredient3"],
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi cupiditate possimus qui ad ratione doloribus dolor est id reiciendis maiores",
    image: samosaImage,
  },
  {
    id: 5,
    name: "Pinneaple",
    price: 50,
    category: "Fruits",
    keyIngredients: ["Ingredient1", "Ingredient2", "Ingredient3"],
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi cupiditate possimus qui ad ratione doloribus dolor est id reiciendis maiores",
    image: pinneapleImage,
  },
  {
    id: 6,
    name: "Chips",
    price: 100,
    category: "Fast",
    keyIngredients: ["Ingredient1", "Ingredient2", "Ingredient3"],
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi cupiditate possimus qui ad ratione doloribus dolor est id reiciendis maiores",
    image: chipsImage,
  },
];
