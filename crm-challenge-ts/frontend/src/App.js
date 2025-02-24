import "./App.css";
import HelloWorld from "./helloWorld";
import CustomerTable from "./customerTable";
import AddCustomerForm from "./addCustomerForm";
import AddTssForm from "./addTssComponent";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <HelloWorld />
        <AddCustomerForm />
        <AddTssForm />
        <CustomerTable />
      </header>
    </div>
  );
}

export default App;
