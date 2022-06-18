import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.APPLICATION_ID,
  process.env.SEARCH_ONLY_API_KEY
);

const algolia = client.initIndex("socialcool");

export default algolia;
