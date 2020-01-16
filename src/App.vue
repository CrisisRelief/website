<template>
  <div id="app">
    <Header />
    <div class="content-wrap">
      <div class="container">
        <div class="intro">
          <h2>Find Resources Near You</h2>
          <p>In a natural disaster emergency, we help you find help or where and how you can help. Listings may have errors or out-dated information, please verify services with the poster.</p>
        </div>
        <SearchBox
          @updated="onSearchBoxUpdate"
          :location_options="filterOptions.locations"
          :category_options="filterOptions.categories"
        />
      </div>
      <div id="results" class="container">
        <span id="hits">
          <span v-if="results.length > 0">{{ results.length }} results</span>
          <span v-else-if="filterParams">No results</span>
        </span>
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
import cheapRuler from "cheap-ruler";
import Fuse from "fuse.js";

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
      orgJSONURI: 'https://' + process.env.VUE_APP_HOSTNAME + '/' + process.env.VUE_APP_ORG_JSON_PATH,
      regionCoords: undefined,
      filterParams: null,
      filterOptions: {
        categories: [],
        locations: []
      }
    };
  },
  mounted() {
    axios.get("/region-coords.json").then(response => {
      this.regionCoords = response.data;
      this.refreshResults();
    });
    axios.get("/australian_postcodes.json").then(response => {
      this.locationCoords = response.data;
      this.refreshLocationFilterOptions();
    });
    axios.get(this.orgJSONURI).then(response => {
      console.log("loading org json from", this.orgJSONURI);
      this.rawData = response.data;
      this.refreshCatFilterOptions();
    });
  },
  methods: {
    refreshCatFilterOptions() {
      const categories = {};
      this.rawData.forEach(org => {
        if (org.category && !Object.keys(categories).includes(org.category)) {
          categories[org.category] = {}
        }
        if (org.category_sub && !Object.keys(categories[org.category]).includes(org.category_sub)) {
          categories[org.category][org.category_sub] = [];
        }
        if (org.category_sub_sub && !categories[org.category][org.category_sub].includes(org.category_sub_sub)) {
          categories[org.category][org.category_sub].push(org.category_sub_sub)
        }
      });
      const category_options = Object.entries(categories).map((entry) => {
        const sub_categories = []
        if(Object.entries(entry[1]).length === 0) {
          entry[1][entry[0]] = []
          entry[1][entry[0]].push("")
        }
        Object.entries(entry[1]).forEach((sub_entry) => {
          if(sub_entry[1].length === 0) {
            sub_entry[1].push("")
          }
          sub_entry[1].forEach((sub_sub_entry) => {
            sub_categories.push({
              category: entry[0],
              subcategory_1: sub_entry[0],
              subcategory_2: sub_sub_entry,
            })
          })
        })
        return {
          category: entry[0],
          subcategories: sub_categories
        }
      });
      this.filterOptions.categories = category_options;
    },
    refreshLocationFilterOptions() {
      const locations = {};
      this.locationCoords.forEach(loc => {
        if (loc.state && !Object.keys(locations).includes(loc.state)) {
          locations[loc.state] = []
        }
        if (loc.locality && !locations[loc.state].includes(loc.locality)) {
          locations[loc.state].push({
            postcode: loc.postcode,
            locality: loc.locality,
            lag: loc.lat,
            long: loc.long
          });
        }
      });
      const location_options = Object.entries(locations).map((entry) => {
        const sub_locations = []
        if(Object.entries(entry[1]).length === 0) {
          entry[1][entry[0]] = []
          entry[1][entry[0]].push("")
        }
        entry[1].forEach((sub_entry) => {
          sub_locations.push({
            location: entry[0],
            ...sub_entry,
          })
        })
        return {
          location: entry[0],
          sublocations: sub_locations
        }
      });
      this.filterOptions.locations = location_options;
    },
    refreshResults() {
      this.results = [this.sortOrgs, this.searchOrgs, this.filterOrgs].reduceRight(
        (orgs, fn) => fn(orgs),
        this.rawData
      );
    },
    sortOrgs(orgs) {
      if (navigator.geolocation && this.regionCoords && orgs) {
        // Can't get user's actual geolocation unless in a proper HTTPS environment, and they authorise it.

        // navigator.geolocation.getCurrentPosition(position => {
        //   this.results = sortOrgsByDistance(response.data, this.regionCoords, position)
        // }, error => {
        //   console.error(error);
        // });
        const position = [145, -37];
        return sortOrgsByDistance(orgs, this.regionCoords, position);
      }
      return orgs;
    },
    filterOrgs(orgs) {
      if (!this.filterParams) {
        return orgs;
      }
      const search_category = this.filterParams["search_category"];
      if (!search_category) {
        return orgs;
      }

      var categories = [search_category]
      if (search_category instanceof Array) {
        categories = search_category
      }
      if (categories) {
        return orgs.filter(org => {
          if (!this.orgInCategories(org, categories)) {
            return false;
          }
          return true;
        });
      }
    },
    orgInCategories(org, categories) {
      var result = false
      categories.forEach((category_spec) => {
        if (org.category != category_spec.category) { return }
        if (org.category_sub != category_spec.subcategory_1) { return }
        if (org.category_sub_sub != category_spec.subcategory_2) { return }
        result = true
      })
      return result
    },
    searchOrgs(orgs) {
      if (!this.filterParams) {
        return orgs;
      }
      const search_term = this.filterParams["search_term"];

      if (search_term) {
        const fuse = new Fuse(orgs, {
          keys: [
            "title",
            "category",
            "category_sub",
            "category_sub_sub",
            "location",
            "lga",
            "description",
            "phone",
            "email",
            "address",
            "link"
          ],
          shouldSort: true
        });
        orgs = fuse.search(search_term);
      }
      return orgs;
    },
    get_uri_from_state() {
      var uri_components = []
      const search_term = this.filterParams["search_term"];
      const search_location = this.filterParams["search_location"];
      const search_category = this.filterParams["search_category"];
      if(search_term){
        uri_components.push('q=' + encodeURI(search_term))
      }
      if(search_location){
        uri_components.push('loc=' + encodeURI(search_location))
      }
      if(search_category){
        uri_components.push('cat=' + encodeURI(search_category))
      }
      return '/?' + uri_components.join('&')
    },
    trackSearchQuery() {
      var params = Object.assign({}, this.filterParams);
      // console.log(params);
      if(!params){ return }
      const path = this.get_uri_from_state();
      window.history.pushState(params, document.title, path);
      this.$gtag.pageview({page_path: path});
      this.$gtag.event('searchQueryParams', JSON.stringify(params));
      this.$gtag.event('searchQuery', params);
      const search_term = params["search_term"];
      const search_location = params["search_location"];
      const search_category = params["search_category"];
      if(search_term){
        this.$gtag.event('submitSearchTerm', {label: search_term});
      }
      if(search_location){
        this.$gtag.event('submitSearchLocation', {label: search_location});
      }
      if(search_category){
        this.$gtag.event('submitSearchCategory', {category: search_category});
      }
      if(this.results.length == 0) {
        this.$gtag.event('noResults');
      }
      if(this.results.length) {
        this.$gtag.event('results', this.results.length);
      }
    },
    onSearchBoxUpdate(params) {
      console.log("onSearchBoxUpdate", JSON.stringify(params));
      this.filterParams = params;
      this.refreshResults();
      this.trackSearchQuery();
    }
  }
};

function searchCmp(a, b) {
  return a.toLowerCase().trim() == b.toLowerCase().trim();
}

function sortOrgsByDistance(results, regionCoords, ourLocation) {
  const ruler = cheapRuler(ourLocation[1]);
  function distance(location) {
    return ruler.distance(location, ourLocation);
  }

  /* For now we are just using centroids of LGAs. */
  function resultCoord(result) {
    let loc =
      result && result.location && String(result.location).toLowerCase();
    loc =
      {
        act: "australian capital territory",
        vic: "victoria",
        nsw: "new south wales",
        tas: "tasmania",
        wa: "western australia",
        sa: "south australia",
        nt: "northern territory",
        qld: "queensland"
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
