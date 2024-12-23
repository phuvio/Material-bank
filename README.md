# Material bank

This is a repository for material bank for [ProNeuron Oy](https://proneuron.fi/). ProNeuron is a Finnish company that offers various therapies such as speech, ergo and psychotherapy. More and more often, therapies are carried out remotely. The company needs a material bank, from which it is possible to quickly and easily search for various test and rehabilitation materials in connection with a video-mediated therapy session. The materials can be e.g. word or pdf files or links to other websites.

[Material bank](https://material-bank-backend-449a0f56d7d0.herokuapp.com/materials)

## Documentation

- [Techstack](/Documentation/techstack.md)
- [Database schema](/Documentation/database.md)
- [Page layouts](/Documentation/pagelayouts.md)
- [Time log](/Documentation/timelog.md)

## Quickstart

### Downloading

```bash
git clone git@github.com:phuvio/Material-bank.git
```

### Installation

Run the following command in root directory:

```bash
npm install
```

Installs the required dependencies on both frontend and backend

### Running the program locally

Running the program locally in development mode:

```bash
git run dev
```

Running tests:

```bash
git run test
```

Running tests with coverage:

```bash
git run dev:coverage
```

Running eslint:

```bash
git run lint
```
