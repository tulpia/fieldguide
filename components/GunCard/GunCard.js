import React from "react";
import { Grid, Card, CardContent, Typography, Paper } from "@material-ui/core";
import Link from "next/link";

const GunCard = ({ data }) => {
  let width = 0;
  let durability;

  if (data.durability && data.durability[0]) {
    durability = data.durability[0];

    Object.keys(durability).map(entry => {
      width += durability[entry];
    });
  }

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Link href="/weapons/[id]" as={`/weapons/${data.id}`}>
        <a style={{ textDecoration: "none" }}>
          <Card>
            <div style={{ height: "250px", width: "100%" }}>
              {data.assets ? (
                <img
                  src={data.assets.image}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              ) : (
                ""
              )}
            </div>
            <CardContent>
              <Typography variant="h6" style={{ textDecoration: "none" }}>
                {data.name}
              </Typography>
              <Typography>
                Attack : {data.attack.display} ({data.attack.raw})
              </Typography>
              <Typography>
                damage type : {data.damageType ? data.damageType : "Raw"}
              </Typography>
              {data.elements.length >= 1 ? (
                <Typography>
                  Element :{" "}
                  {`${data.elements[0].type} (${data.elements[0].damage})${
                    data.elements[0].hidden ? " hidden" : ""
                  }`}
                </Typography>
              ) : (
                <Typography>Elementless</Typography>
              )}
              <Typography style={{ marginTop: "20Px" }}>
                Base durability (no handicraft)
              </Typography>
              {durability ? (
                <Paper style={{ marginTop: "5px" }}>
                  <article
                    style={{ width: "100%", height: "35px", display: "flex" }}
                  >
                    {Object.keys(durability).map((entry, index) => {
                      const singleWidth = (durability[entry] * width) / 100;

                      return (
                        <div
                          key={index}
                          style={{
                            width: `${singleWidth}%`,
                            backgroundColor: entry
                          }}
                        ></div>
                      );
                    })}
                  </article>
                </Paper>
              ) : (
                ""
              )}
            </CardContent>
          </Card>
        </a>
      </Link>
    </Grid>
  );
};

export default GunCard;
