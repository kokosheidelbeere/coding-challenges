import './App.css';
import HelloWorld from './helloWorld';
import CustomerTable from './customerTable';
import AddCustomerForm from './addCustomerForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <HelloWorld />
        <AddCustomerForm />
        <CustomerTable />
      </header>
    </div>
  );
}

export default App;