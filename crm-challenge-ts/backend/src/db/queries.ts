import queryDb from './postgres';

export function getCustomer(customer_id: string): Promise<string[]> {
  const queryString: string = `
  SELECT customer_id, first_name, last_name, mail
  FROM customers
  WHERE customer_id = $1
  `;
  const values = [customer_id];

  return queryDb({ text: queryString, values });
}

//Parametirized query to prevent SQL-injections. 

export function addCustomer(firstName: string, lastName: string, email: string): Promise<string[]> {
  const queryString: string = `
  INSERT INTO customers (first_name, last_name, mail)
  VALUES ($1, $2, $3)
  RETURNING customer_id, first_name, last_name, mail
  `;
  const values = [firstName, lastName, email];

  return queryDb({ text: queryString, values });
}

export function getAllCustomers(): Promise<string[]> {
  const queryString: string = `
  SELECT customer_id, first_name, last_name, mail
  FROM customers
  ORDER BY last_name, first_name
  `;
  
  return queryDb({ text: queryString });
}