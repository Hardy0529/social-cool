import algoliasearch from "algoliasearch";

const client = algoliasearch("QEAD1T33OX", "fa4c994d19844a6a60e34a2b7371e3ff");

const algolia = client.initIndex("socialcool");

export default algolia;
