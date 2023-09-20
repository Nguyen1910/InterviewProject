import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import "./App.css";
import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  ToggleButton,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ItemByCategory from "./components/ItemByCategory";
import { useQuery } from "react-query";
import { Product } from "./models/Product";
import { GetProductsApiResponse } from "./models/GetProductsApiResponse";

type ProductsByCategory = {
  [category: string]: Product[];
};

function App() {
  const [category, setCategory] = useState<string>("");
  const [list, setList] = useState<ProductsByCategory>({});
  const [query, setQuery] = useState<string>("");

  const { isLoading, error, data, refetch } = useQuery("repoData", () =>
    fetch(
      query
        ? `https://dummyjson.com/products/search?q=${query}`
        : `https://dummyjson.com/products`
    ).then((res) => res.json())
  );

  const groupedProducts = useMemo(
    () => (data: GetProductsApiResponse) =>
      data?.products?.reduce((acc: ProductsByCategory, product: Product) => {
        const { category } = product;

        // If the category doesn't exist in the accumulator, create an empty array for it
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      }, {}),
    []
  );

  useEffect(() => {
    refetch();
  }, [query]);

  useEffect(() => {
    if (data) {
      setList({ ...groupedProducts(data) });
    }
  }, [data]);

  const handleInputSearch = () => {
    refetch();
  };

  const handleClickOpen = (cate: string) => {
    if (cate === category) {
      setCategory("");
    } else {
      setCategory(cate);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="wrapper">
          <FormControl
            sx={{
              width: "280px",
              height: "100%",
            }}
          >
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment
                  position="end"
                  onClick={() => {
                    setQuery("");
                  }}
                >
                  {query && (
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      {true ? (
                        <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                      ) : null}
                    </IconButton>
                  )}
                </InputAdornment>
              }
              sx={{
                ml: 1,
                flex: 1,
                borderRadius: 50,
                height: "100%",
                backgroundColor: "#F8F8F9",
              }}
              placeholder="Search"
              inputProps={{ "aria-label": "Search" }}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleInputSearch();
                }
              }}
              value={query}
            />
          </FormControl>
          {query && (
            <ToggleButton
              value="check"
              sx={{
                border: "none",
                textTransform: "none",
                color: "#000",
                ":hover": { backgroundColor: "#F8F8F9" },
                letterSpacing: 0,
                padding: "7px 8px",
                borderRadius: "8px",
                width: "72px",
              }}
              onClick={() => setQuery("")}
            >
              Cancel
            </ToggleButton>
          )}
        </div>
        <div className="productList">
          <h2>Product List</h2>
          <Divider sx={{ flex: 1, borderStyle: "dashed", ml: "10px" }} />
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              flex: 1,
            }}
            component="nav"
          >
            {Object.keys(list).map((cate: string, index: number) => (
              <div key={index}>
                <ListItemButton onClick={() => handleClickOpen(cate)}>
                  {category === cate ? (
                    <ExpandLess
                      sx={{ fontSize: "18px", color: "#B1B8C0", mr: "14px" }}
                    />
                  ) : (
                    <ExpandMore
                      sx={{ fontSize: "18px", color: "#B1B8C0", mr: "14px" }}
                    />
                  )}
                  <ListItemText primary={<h3>{cate}</h3>} />
                </ListItemButton>
                <Collapse in={category === cate} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {list[cate].map((item, index) => (
                      <ItemByCategory productProp={item} key={index} />
                    ))}
                  </List>
                </Collapse>
              </div>
            ))}
          </List>
        )}
      </div>
    </div>
  );
}

export default App;
