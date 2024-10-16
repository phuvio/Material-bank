# Database

PostgrSQL was chosen, because it offers ACID transactions.

## Schema

Schema is based around materials. Each material has a single user who has downloaded that material to the database. Each material can have several tags which mark what the material is used for. Each user has a favorites list where they can mark their favorite materials. Admins can create groups to which group of materials can be added for a specific purposes. Customers are end users to whom the user gives the materials. User can then mark if the material has been given to the customer and whether the customer has completed the materials.

```mermaid
erDiagram
    %% Schemas and Tables
    Materials {
        SERIAL id
        VARCHAR(50) name
        VARCHAR(500) description
        BOOLEAN visible
        INTEGER user_id
        BOOLEAN is_URL
        VARCHAR(120) URL
        BYTEA material
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    Users {
        SERIAL id
        VARCHAR(20) username
        VARCHAR password
        INTEGER role
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    Favorites {
        SERIAL id
        INTEGER material_id
        INTEGER user_id
    }

    Tags {
        SERIAL id
        VARCHAR(50) name
        INTEGER visible
    }

    Tags_Materials {
        INTEGER material_id
        INTEGER tag_id
    }

    Groups {
        SERIAL id
        INTEGER user_id
        INTEGER material_id
        VARCHAR(500) description
        BOOLEAN visible
    }

    Groups_Materials {
        SERIAL id
        INTEGER group_id
        INTEGER material_id
    }

    Customers {
        SERIAL id
        INTEGER code
        INTEGER user_id
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    Customers_Materials {
        SERIAL id
        INTEGER customer_id
        INTEGER material_id
        VARCHAR(20) status
    }

    %% Relationships
    Users ||--o{ Favorites : "user_id"
    Materials ||--o{ Favorites : "material_id"
    Tags ||--o{ Tags_Materials : "tag_id"
    Materials ||--o{ Tags_Materials : "material_id"
    Materials ||--o{ Groups : "material_id"
    Users ||--o{ Materials : "user_id"
    Users ||--o{ Groups : "user_id"
    Groups ||--o{ Groups_Materials : "group_id"
    Materials ||--o{ Groups_Materials : "material_id"
    Users ||--o{ Customers : "user_id"
    Customers ||--o{ Customers_Materials : "customer_id"
    Materials ||--o{ Customers_Materials : "material_id"
```

There are timestamps on materials, users and customers. Timestamps for users give information when the password has been renewed last time. Password is forced to renew at least once a year. Timestamps for customers are for GDPR purposes. When the customer ends his/her customership with ProNeuron the data is kept 3 years and then deleted. Timestamps for materials have no use at the moment, but are inserted for future use.

Here is the [PostgerSQL schema](../backend/dBStartup/schema.sql).
