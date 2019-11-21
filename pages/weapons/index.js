import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import {
  Container,
  Grid,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Card,
  CardContent,
  Typography
} from "@material-ui/core";
import Link from "next/link";
import fetch from "isomorphic-unfetch";

const setLocalStorage = id => {
  localStorage.setItem("gunType", id);
};

const Weapons = ({ data, gunTypes }) => {
  const [s_selectedGunType, setSelectedGuntype] = useState(false);

  const handeChangeSelect = event => {
    setSelectedGuntype(event.target.value);
    setLocalStorage(event.target.value);
  };

  // ComponentDidMount dans un component stateless
  useEffect(() => {
    if (localStorage.getItem("gunType") && !s_selectedGunType) {
      setSelectedGuntype(localStorage.getItem("gunType"));
    }
  }, []);

  return (
    <main>
      <Header name="Liste des armes"></Header>
      <Container maxWidth="lg" style={{ marginTop: "20px" }}>
        <Grid container justify="space-between" spacing={3}>
          {s_selectedGunType ? (
            <>
              <Grid item xs={12}>
                <FormControl style={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    style={{ padding: "0 0 5px 0" }}
                    value={s_selectedGunType}
                    onChange={handeChangeSelect}
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
              {data
                .filter(entry => entry.type === s_selectedGunType)
                .map(gun => {
                  return (
                    <Grid item xs={12} sm={6} md={3} key={gun.id}>
                      <Link href="/weapons/[id]" as={`/weapons/${gun.id}`}>
                        <a>
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
                        </a>
                      </Link>
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
