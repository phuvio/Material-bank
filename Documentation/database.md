# Database

PostgrSQL was chosen, because it offers ACID transactions.

## Schema

Schema is based around materials. Each material has a single user who has downloaded that material to the database. Each material can have several tags which mark what the material is used for. Each user has a favorites list where they can mark their favorite materials. Admins can create groups to which materials can be added for a specific purpose. Customers are end users to whom the user gives the materials. User can then mark if the material has been given to the customer and whether the customer has completed the materials.

![Schema](/Documentation/Pictures/Schema.png)
