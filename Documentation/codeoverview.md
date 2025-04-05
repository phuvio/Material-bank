# Code overview

The application is hosted on Heroku. The actual URL [www.prone-materiaalipankki.fi](https://www.prone-materiaalipankki.fi) is an alias that directs traffic to Heroku.

## Role based access control

The application has simple role based access control. Roles are visible in the [`userRoles.js`](/frontend/src/config/userRoles.js) file, where they can also be added. The file [`RouterConfig.jsx`](/frontend/src/config/RoutesConfig.jsx) contains the application links. For each link, the roles that can use it are defined.

## Access and refresh tokens

The application uses access and refresh tokens. They are set in [`login.js`](/backend/controllers/login.js) file in backend. In frontend api service [`api.js`](/frontend/src/services/api.js) employs Axios interceptors to handle authentication and refresh tokens.
