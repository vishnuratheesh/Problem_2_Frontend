###Problem 2 - (Frontend)


####Problem:

  Customers often have complaints which call the customer service representatives and talk to. The CSR then logs the information by choosing the available areas to which the issue is related to, into the system. This record is called as a ticket. A ticket has the below details:

    1. Customer Information

    2. Comments

    3. Created By

    4. Assigned To

    5. Status (New,Open – once it is assigned to someone,Closed)

  You are free to create the list of areas. Create all the required data through backend scripts or any other means

  This application should have a UI with/without authentication to 

    1. Log the ticket.

    2. Add Comments to a ticket

    3. Change the status

    4. Assign to

    5. Once closed this ticket should not be editable

    6. View the tickets

    7. Has to work with REST Services in the backend.

  Feel free to implement any improvement you see fit for this application.
  
####Solution

  $ cd backend
  $ virtualenv env
  $ . env/bin/activate
  $ pip install flask
  $ pip freeze > requirements.txt