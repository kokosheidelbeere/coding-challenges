import queryDb from './postgres';

//Parametirized queroies to prevent SQL-injections.

export function getCustomer(customer_id: string): Promise<string[]> {
  const queryString: string = `
  SELECT customer_id, first_name, last_name, mail
  FROM customers
  WHERE customer_id = $1
  `;
  const values = [customer_id];

  return queryDb({ text: queryString, values });
}

export function addCustomer(
  customer_id: string,
  firstName: string,
  lastName: string,
  email: string,
): Promise<string[]> {
  const queryString: string = `
  INSERT INTO customers (customer_id, first_name, last_name, mail, tss_id)
  VALUES ($1, $2, $3, $4, NULL)
  RETURNING customer_id, first_name, last_name, mail, tss_id
  `;
  const values = [customer_id, firstName, lastName, email];

  return queryDb({ text: queryString, values });
}

export function getAllCustomers(): Promise<string[]> {
  const queryString: string = `
    SELECT 
      c.customer_id,
      c.first_name,
      c.last_name,
      c.mail,
      ARRAY_AGG(c.tss_id) FILTER (WHERE c.tss_id IS NOT NULL) as tss_list
    FROM customers c
    GROUP BY 
      c.customer_id,
      c.first_name,
      c.last_name,
      c.mail
    ORDER BY c.last_name, c.first_name
  `;

  return queryDb({ text: queryString });
}

export function findCustomerByEmail(email: string): Promise<string[]> {
  const queryString: string = `
  SELECT customer_id, first_name, last_name, mail
  FROM customers
  WHERE mail = $1
  LIMIT 1
  `;
  const values = [email];

  return queryDb({ text: queryString, values });
}

export function addTssToCustomer(
  customerId: string,
  tssId: string,
): Promise<string[]> {
  const queryString: string = `
  WITH customer_check AS (
    SELECT customer_id, first_name, last_name, mail
    FROM customers
    WHERE customer_id = $1::uuid
    LIMIT 1
  )
  INSERT INTO customers (customer_id, first_name, last_name, mail, tss_id)
  SELECT 
    customer_id,
    first_name,
    last_name,
    mail,
    $2::uuid as tss_id
  FROM customer_check
  RETURNING customer_id, first_name, last_name, mail, tss_id
  `;

  const values = [customerId, tssId];
  return queryDb({ text: queryString, values });
}
