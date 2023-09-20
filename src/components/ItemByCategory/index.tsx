import React from "react";
import "./itemByCategory.css";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import InputBase from "@mui/material/InputBase";
import { ToggleButton } from "@mui/material";
import { Product } from "../../models/Product";
import { numberWithCommas } from "../../utils/format";
import { useQueryClient } from "react-query";

const productQueryKey = "repoData";

type Props = {
  productProp: Product;
};

const Index = ({ productProp }: Props) => {
  const [edit, setEdit] = useState(false);

  const queryClient = useQueryClient();
  const cachedProducts: any = queryClient.getQueryData(productQueryKey);

  const handleNameChange = (productId: number, newName: string) => {
    // Perform an optimistic update by updating the product name in the cache
    const updatedProducts = cachedProducts?.products.map((product: Product) => {
      if (product.id === productId) {
        return { ...product, title: newName };
      }
      return product;
    });
    // update product list in cache
    queryClient.setQueryData(productQueryKey, {
      ...cachedProducts,
      products: updatedProducts,
    });
  };

  return (
    <div className="itemByCategoryContainer">
      <img
        src={productProp?.images.length > 0 ? productProp.images[0] : ""}
        className="image"
      />
      <div style={{ flex: 1 }}>
        {edit ? (
          <InputBase
            onBlur={() => setEdit(false)}
            sx={{
              flex: 1,
              fontSize: "16px",
              lineHeight: "20px",
              fontWeight: "bold",
              backgroundColor: edit ? "#F2F4F6" : "#fff",
              width: "100%",
              padding: "1px 8px",
              borderRadius: "8px",
              border: "1px solid #6713EF",
            }}
            placeholder=""
            value={productProp?.title}
            autoFocus
            onChange={(e) => handleNameChange(productProp.id, e.target.value)}
          />
        ) : (
          <ToggleButton
            value="check"
            //   selected={selected}
            //   onChange={() => {
            //     setSelected(!selected);
            //   }}
            onClick={() => setEdit(true)}
            sx={{
              border: "none",
              textTransform: "none",
              color: "#000",
              justifyContent: "start",
              ":hover": { backgroundColor: "#F8F8F9" },
              ":focus": { border: "1px solid #6713EF" },
              letterSpacing: 0,
              padding: "7px 8px",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            <h4 className="limitText">{productProp?.title}</h4>
          </ToggleButton>
        )}
        <ListItemText
          secondary={`$ ${numberWithCommas(productProp.price)}`}
          sx={{
            padding: "0px 8px",
          }}
        />
      </div>
    </div>
  );
};

export default Index;
