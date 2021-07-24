import Nav from "../Components/Nav";
const Layout = (props) => {
  return (
    <main>
      <Nav />
      <div>{props.children}</div>
    </main>
  );
};

export default Layout;
