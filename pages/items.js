import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import Header from "../components/Header/Header";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Container
} from "@material-ui/core";

const Items = ({ data }) => {
  const [items, setItems] = useState(data);
  const firstRow = Object.entries(items[0]).map(entry =>
    entry.splice(0, 1).join()
  );

  return (
    <main>
      <Header name="Liste des item" />
      <Container maxWidth="lg" style={{ marginTop: "20px" }}>
        <Paper>
          <Table>
            <TableHead>
              {firstRow.map((row, index) => {
                if (row !== "id" && row !== "description") {
                  if (row === "name") {
                    return <TableCell key={index}>{row}</TableCell>;
                  } else {
                    return (
                      <TableCell align="right" key={index}>
                        {row}
                      </TableCell>
                    );
                  }
                }
              })}
            </TableHead>
            <TableBody>
              {items.map(item => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link href="/items/[id]" as={`/items/${item.id}`}>
                        <a style={{ textDecoration: "none" }}>
                          <Typography variant="body1" color="primary">
                            {item.name}
                          </Typography>
                        </a>
                      </Link>
                    </TableCell>
                    <TableCell align="right">{item.rarity}</TableCell>
                    <TableCell align="right">{item.carryLimit}</TableCell>
                    <TableCell align="right">{item.value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </main>
  );
};

Items.getInitialProps = async function() {
  const res = await fetch("https://mhw-db.com/items");
  const data = await res.json();

  return {
    data
  };
};

export default Items;
