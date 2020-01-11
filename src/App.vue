<template>
  <div id="app">
    <Header />
    <div class="content-wrap">
      <SearchBox />
      <div id="results">
        <span id="hits">15 organisations</span>
        <SearchResult
          v-for="(result, index) in results"
          :key="index"
          :title="result.title"
          :categories="result.categories"
          :location="result.location"
          :description="result.description"
          :contact="result.contact"
          :link="result.link"
        />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import SearchResult from "./components/SearchResult.vue";
import Header from "./components/Header.vue";
import SearchBox from "./components/SearchBox.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "app",
  components: {
    SearchResult,
    Header,
    SearchBox,
    Footer
  },
  data() {
    return {
      results: []
    };
  },
  mounted() {
    this.results = require("../public/organisations.json");
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap");

body div {
  text-align: left;
  color: #1b2a49; /* Navy */
  font-size: 14px;
}

.content-wrap {
  padding-bottom: 2.5rem;
}

#app {
  font-family: "Source Sans Pro", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  position: relative;
  min-height: 100vh;
}

#results {
  padding: 20px;
}

#hits {
  font-weight: bolder;
  font-size: large;
}

body a {
  color: #02909e; /* Turquoise */
}
</style>
