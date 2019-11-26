import React from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";

const SelectGunTypes = ({ selectValue, selectOnChange, gunTypes }) => (
  <Grid item xs={12}>
    <FormControl style={{ width: "100%" }}>
      <InputLabel id="demo-simple-select-label">Type</InputLabel>
      <Select
        style={{ padding: "0 0 5px 0" }}
        value={selectValue}
        onChange={selectOnChange}
      >
        {gunTypes.map((type, index) => {
          return (
            <MenuItem key={index} value={type}>
              {type}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  </Grid>
);

export default SelectGunTypes;
