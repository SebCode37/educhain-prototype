# educhain-prototype

This codebase is a prototype of the Educhain project which was developed by Felix Hildebrandt and Sebastian Wunderlich during their master studies on the University of Applied Sciences Mittweida. It aims to integrate blockchain technology at universities in order to facilitate processes.

The prototype is one utility of the Educhain concept which can be used to create file proofs for documents that need to be managed by the proffessorship and issue tokens for IRL benefits at the presentation that took place in 2021.

> **_NOTE:_** The commentary and filenames might appear in German.

## Project Description

![](/img/educhain-webpage.png)

The goal of the proof of concept project was to be able to use student ID cards across universities and devices, to validate data exchange between students and professorships in a matter of seconds, to control lockers and locks digitally, and to securely pay for services at colleges and universities such as the refectory from a smartphone. With a network of participating colleges and universities, students can use various services from external universities. This principle is similar to the eduroam solution, widely used today, and ensures Internet access across universities.

The goal was to manage university user accounts using [ERC725](https://eips.ethereum.org/EIPS/eip-725), allowing students and staff to manage their responsibilities, such as claims, proofs, payments, and even physical access controls, like opening doors, using account signatures.

## Links

- [Educhain Webpage](https://educhain-mw.de/)
- [Prototype Application](https://educhain-mw.netlify.app/)
- [Project Handout, 1 Page](https://educhain-mw.de/docs/educhain_abstract.pdf)
- [Full Project Paper, 110 Pages](https://educhain-mw.de/docs/educhain_technical_paper.pdf)

## Data Proof Prototype Showcase

![Screenshot 1](./img/screenshot_01.png)
![Screenshot 2](./img/screenshot_02.png)

### Verification Workflow

![Prototype Flow](./img/prototype_flow.png)

### Contract Clone Pattern

![Design Pattern](./img/design_pattern.png)

## Development

#### Initialize the project

`cd educhain_prototype && npm i`

#### Run the project locally

`npm start`

#### Create a production build

`npm run build`
