//include exprss from node_modules
const express = require("express");
const app = express();
var path = require('path');

//variables
const restaurantList = require("./restaurant.json");

//Define server related variables
const port = 3000;

//require express-handlebars
const { engine } = require("express-handlebars");

//setting template engine
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
console.log(path.join(__dirname + '/public'))
//setting static files
app.use(express.static('public'));

//request & response
app.get("/", (req, res) => {
  res.render("index", { restaurants: restaurantList.results });
});

//針對特定餐廳設定不同路由 & res
app.get("/restaurants/:id", (req, res) => {
  let restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.id
  );
  res.render("show", { restaurant });
});

//產生搜尋的路由
app.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  let findRestaruant = restaurantList.results.filter((restaurant) =>
    (restaurant.name + restaurant.category)
      .toLowerCase()
      .includes(keyword.toLowerCase().trim())
  );
  res.render("index", { restaurants: findRestaruant, keyword });
});

//start and listen the server
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});
