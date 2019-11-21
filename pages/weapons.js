import React, { useState } from "react";
import Header from "../components/Header/Header";
import {
  Container,
  Grid,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Card,
  CardMedia,
  CardContent,
  Typography
} from "@material-ui/core";
import Link from "next/link";
import fetch from "isomorphic-unfetch";

const Weapons = ({ data, gunTypes }) => {
  const [gunType, setGuntype] = useState(gunTypes);
  const [selectedGunType, setSelectedGuntype] = useState(false);

  const handeChangeSelect = event => {
    setSelectedGuntype(event.target.value);
  };

  return (
    <main>
      <Header name="Liste des armes"></Header>
      <Container maxWidth="lg" style={{ marginTop: "20px" }}>
        <Grid container justify="space-between" spacing={3}>
          {selectedGunType ? (
            <>
              <Grid item xs={12}>
                <FormControl style={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    style={{ padding: "0 0 5px 0" }}
                    value={selectedGunType}
                    onChange={handeChangeSelect}
                  >
                    {gunType.map((type, index) => {
                      return (
                        <MenuItem key={index} value={type}>
                          {type}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {data
                .filter(entry => entry.type === selectedGunType)
                .map(gun => {
                  return (
                    <Grid item xs={4} key={gun.id}>
                      <Card>
                        <div style={{ height: "250px", width: "100%" }}>
                          {gun.assets ? (
                            <img
                              src={gun.assets.image}
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
                          <Typography variant="h6">{gun.name}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
            </>
          ) : (
            <Grid item xs={12}>
              <FormControl style={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  style={{ padding: "0 0 5px 0" }}
                  value=""
                  onChange={handeChangeSelect}
                >
                  {gunType.map((type, index) => {
                    return (
                      <MenuItem key={index} value={type}>
                        {type}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Container>
    </main>
  );
};

Weapons.getInitialProps = async function() {
  const request = await fetch("https://mhw-db.com/weapons");
  const data = await request.json();

  const gunTypes = [];
  for (const gun of data) {
    if (!gunTypes.includes(gun.type)) {
      gunTypes.push(gun.type);
    }
  }

  return { data, gunTypes };
};

export default Weapons;
