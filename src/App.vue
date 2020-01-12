<template>
  <div id="app">
    <Header />
    <div class="content-wrap">
      <SearchBox
        @updated="onSearchBoxUpdate"
        :search_locations="filterOptions.locations"
        :search_categories="filterOptions.categories"
      />
      <div id="results" class="container">
        <span id="hits">{{ results.length }} results</span>
        <SearchResult
          v-for="(result, index) in results"
          :key="index"
          :title="result.title"
          :category="result.category"
          :category_sub="result.category_sub"
          :category_sub_sub="result.category_sub_sub"
          :location="result.lga"
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
      rawData: [],
      results: [],
      prodUrl: "https://crisis.app/",
      regionCoords: undefined,
      filterParams: {},
      filterOptions: {
        categories: [],
        locations: []
      }
    };
  },
  mounted() {
    axios.get('/region-coords.json').then(response => {
      this.regionCoords = response.data;
      this.refreshResults();
    });
    axios.get(this.prodUrl + "json/organisations.json").then(response => {
      this.rawData = response.data;
      this.refreshResults();
      this.refreshFilterOptions();
    });
  },
  methods: {
    refreshFilterOptions() {
      const categories = [];
      const locations = [];
      this.rawData.forEach((org) => {
        if(org.category && !categories.includes(org.category)) {
          categories.push(org.category)
        };
        if(org.location && !locations.includes(org.location)) {
          locations.push(org.location)
        };
      });
      this.filterOptions.locations = locations;
      this.filterOptions.categories = categories;
    },
    refreshResults() {
      this.results = [
        this.sortOrgs,
        this.filterOrgs,
      ].reduceRight((orgs, fn) => fn(orgs), this.rawData);
    },
    sortOrgs(orgs) {
      if (navigator.geolocation && this.regionCoords && orgs) {
        // Can't get user's actual geolocation unless in a proper HTTPS environment, and they authorise it.

        // navigator.geolocation.getCurrentPosition(position => {
        //   this.results = sortOrgsByDistance(response.data, this.regionCoords, position)
        // }, error => {
        //   console.error(error);
        // });
        const position = [145,-37];
        return sortOrgsByDistance(orgs, this.regionCoords, position);
      }
      return orgs
    },
    filterOrgs(orgs) {
      if ( this.filterParams ) {
        const search_term = this.filterParams['search_term']
        const search_location = this.filterParams['search_location']
        const search_category = this.filterParams['search_category']
        return orgs.filter((org) => {
          if (search_term && ! searchContains(JSON.stringify(org), search_term)) {
            return false;
          }
          if (search_location && ! searchCmp(org.location, search_location)) {
            return false;
          }
          if (search_category && ! searchCmp(org.category, search_category)) {
            return false;
          }
          return true;
        })
      }
      return orgs
    },
    onSearchBoxUpdate(params) {
      this.filterParams = params;
      this.refreshResults()
    }
  }
}

function searchCmp(a, b) {
  return a.toLowerCase().trim() == b.toLowerCase().trim();
}

function searchContains(a, b) {
  return a.toLowerCase().trim().indexOf(b.toLowerCase().trim()) !== -1 ;
}

function sortOrgsByDistance(results, regionCoords, ourLocation) {
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
