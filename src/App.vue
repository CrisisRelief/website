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
          :category="result.category"
          :category_sub="result.category_sub"
          :category_sub_sub="result.category_sub_sub"
          :location="result.location"
          :description="result.description"
          :phone="result.phone"
          :email="result.email"
          :address="result.address"
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
import axios from "axios";
import cheapRuler from 'cheap-ruler';
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
      results: [],
      protUrl: "https://crisis.app/",
      regionCoords: undefined
    };
  },
  mounted() {
    this.results = [];
    axios.get(this.protUrl + "json/organisations.json").then(response => {
      /* eslint no-console: ["error", { allow: ["log"] }] */
      console.log(response);
      this.results = response.data;
      this.sortResults();
    });
    axios.get('/region-coords.json').then(response => {
      this.regionCoords = response.data;
      this.sortResults();
    });
  },
  methods: {
    sortResults() {
      if (navigator.geolocation && this.regionCoords && this.results) {
        // Can't get user's actual geolocation unless in a proper HTTPS environment, and they authorise it.

        // navigator.geolocation.getCurrentPosition(position => {
        //   this.results = sortResultsByDistance(response.data, this.regionCoords, position)
        // }, error => {
        //   console.error(error);
        // });
        const position = [145,-37];
        this.results = sortResultsByDistance(this.results, this.regionCoords, position);
      }
    }
  }
}

function sortResultsByDistance(results, regionCoords, ourLocation) {
  const ruler = cheapRuler(ourLocation[1]);
  function distance(location) {
    return ruler.distance(location, ourLocation); 
  }
  
  /* For now we are just using centroids of LGAs. */
  function resultCoord(result) {
    let loc = result && result.location && String(result.location).toLowerCase();
    loc = {
      act: 'australian capital territory',
      vic: 'victoria',
      nsw: 'new south wales',
      tas: 'tasmania',
      wa: 'western australia',
      sa: 'south australia',
      nt: 'northern territory',
      qld: 'queensland'
    }[loc] || loc;
    if (loc && regionCoords[loc]) {
      return regionCoords[loc].lngLat;
    } else if (loc) {
      // console.log(`Couldn't geocode ${loc}`);
    }
  }

  function sortFunc(a, b) {
    const [coordA, coordB] = [resultCoord(a), resultCoord(b)];
    // TODO some sensible strategy for dealing with location-less resources
    if (coordA && coordB) {
      return distance(resultCoord(a)) - distance(resultCoord(b));
    } else if (coordA) {
      return -1; 
    } else {
      return 1;
    }
  }
  return results.sort(sortFunc);
}

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
