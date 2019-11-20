import { AppBar, Typography, Toolbar, CssBaseline } from "@material-ui/core";

const Header = ({ name }) => {
  return (
    <header>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">{name}</Typography>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
