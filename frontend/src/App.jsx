import Header from "./components/Header";
import Main_page from "./components/Main_page";

const App = ({ materials }) => {

  return (
    <div>
      <Header />
      <Main_page materials={materials} />
    </div>
  )
};

export default App;
