<template>
  <div id="app">
    <Header />
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
</template>

<script>
import SearchResult from "./components/SearchResult.vue";
import Header from "./components/Header.vue";
import SearchBox from "./components/SearchBox.vue";

export default {
  name: "app",
  components: {
    SearchResult,
    Header,
    SearchBox
  },
  data() {
    return {
      results: [
        {
          title: "Animal Collective Rescue",
          categories: ["Animals", "Boarding", "All"],
          location: "Anywhere",
          description:
            "This is a joint project of many rescue groups around Australia and is a registered business name as part of the MKC.",
          contact: {
            phone: "(02) 6351 4515",
            email: "info@ausecosystems.org.au",
            address: "NSW, ARFCG, 1/382-384 Mowbray Rd, Lane Cove NSW 2066"
          },
          link: "#"
        },
        {
          title: "Guzman Y Gomez",
          categories: ["General assistance", "Food/drinks"],
          location: "Anywhere",
          description:
            "GYG would like to invite all RFS volunteers and emergency workers, and their families to any GYG nationally on 18-19 january to have a burrito on us.",
          contact: {
            website: "#"
          },
          link: "#"
        },
        {
          title: "Legal Aid NSW",
          categories: ["General assistance", "Legal"],
          location: "Anywhere",
          contact: {
            phone: "(02) 6351 4515"
          }
        }
      ]
    };
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap");

body {
  text-align: left;
  color: #1b2a49; /* Navy */
  font-size: 14px;
}

#app {
  font-family: "Source Sans Pro", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#results {
  padding: 20px;
}

#hits {
  font-weight: bolder;
  font-size: large;
}

a {
  color: #02909e; /* Turquoise */
}
</style>
