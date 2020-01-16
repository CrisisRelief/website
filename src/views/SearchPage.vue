<template>
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
        :value="filterParams"
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
</template>


<script>
import SearchResult from "../components/SearchResult.vue";
import SearchBox from "../components/SearchBox.vue";
import axios from "axios";
import cheapRuler from "cheap-ruler";
import Fuse from "fuse.js";

export default {
  components: {
    SearchResult,
    SearchBox
  },
  data() {
    return {
      rawData: [],
      results: [],
      orgJSONURI: 'https://' + process.env.VUE_APP_HOSTNAME + '/' + process.env.VUE_APP_ORG_JSON_PATH,
      regionCoords: undefined,
      filterParams: {
        category: {},
        location: {}
      },
      filterOptions: {
        categories: [],
        locations: []
      },
      showResults: false
    };
  },
  mounted() {
    // this.checkUri();
    var promises = [
      axios.get("/region-coords.json").then(response => {
        this.regionCoords = response.data;
      }),
      axios.get("/australian_postcodes.json").then(response => {
        this.locationCoords = response.data;
        this.refreshLocationFilterOptions();
      }),
      axios.get(this.orgJSONURI).then(response => {
        console.log("loading org json from", this.orgJSONURI);
        this.rawData = response.data;
        this.refreshCatFilterOptions();
      })
    ]
    async function callAfterAwait(promises, cb) {
      await Promise.all(promises)
      cb()
    }
    callAfterAwait(promises, this.refreshResults)
  },
  methods: {
    checkUri(){
      const params = Object.assign({}, this.filterParams);
      const uri = window.location.href.split('?');
      if (uri.length === 2)
      {
        const queryParameters = uri[1].split('&');
        queryParameters.forEach( queryParameter => {
          const queryKeyAndValue = queryParameter.split('=');
          const queryValue = queryKeyAndValue[1] ? queryKeyAndValue[1].replace(/%20/g, " ") : null;
          if(queryKeyAndValue[0] === 'q'){
            params["term"] = decodeURIComponent(queryValue);
            this.showResults = true
          }
          if(queryKeyAndValue[0] === 'loc'){
            params["location"] = JSON.parse(decodeURIComponent(queryValue));
            this.showResults = true
          }
          if(queryKeyAndValue[0] === 'cat'){
            params["category"] = JSON.parse(decodeURIComponent(queryValue));
            this.showResults = true
          }
        });
        this.filterParams = params;
      }
    },
    refreshCatFilterOptions() {
      const categories = [];
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
      if ( !this.showResults ) { return }
      this.results = [this.sortOrgs, this.searchOrgs, this.filterOrgs].reduceRight(
        (orgs, fn) => fn(orgs),
        this.rawData
      );
    },
    geocodeState(state) {
      var loc = String(state).toLowerCase();
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
      if (loc && this.regionCoords[loc]) {
        return this.regionCoords[loc].lngLat;
      } else if (loc) {
        // console.log(`Couldn't geocode ${loc}`);
      }
    },
    getSearchPosition() {
      var position = [145, -37];
      if (!this.filterParams) {
        return null;
      }
      const search_location = this.filterParams["location"];
      if (search_location) {
        var location = search_location
        if (search_location instanceof Array) {
          location = search_location[0]
        }
        console.log(`location ${JSON.stringify(location)}`)
        if (location.lat && location.long) {
          position = [location.long, location.lat]
        } else if (location.location) {
          position = this.geocodeState(location.location)
        }
      }

      // if (navigator.geolocation && this.regionCoords) {
      //   // Can't get user's actual geolocation unless in a proper HTTPS environment, and they authorise it.

      //   // navigator.geolocation.getCurrentPosition(position => {
      //   //   this.results = sortOrgsByDistance(response.data, this.regionCoords, position)
      //   // }, error => {
      //   //   console.error(error);
      //   // });
      // }
      return position
    },
    sortOrgs(orgs) {
      const position = this.getSearchPosition()
      if (position && position[0] && position[1] && orgs.length) {
        var orgsWithPosition = []
        var orgsWithOutPosition = []
        orgs.forEach((org) => {
          if(org.lat && org.long) {
            orgsWithPosition.push(org);
          } else {
            orgsWithOutPosition.push(org);
          }
        })
        orgsWithPosition = sortOrgsByDistance(orgsWithPosition, this.regionCoords, position)
        var result = orgsWithPosition.concat(orgsWithOutPosition)
        return result
      }
      return orgs;
    },
    filterOrgs(orgs) {
      if (!this.filterParams) {
        return orgs;
      }
      const search_category = this.filterParams["category"];
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
      const search_term = this.filterParams["term"];

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
    getHumanSearchTerm() {
      return this.filterParams["term"];
    },
    getHumanSearchLocation() {
      var search_location = this.filterParams["location"];
      if(search_location){
        search_location = JSON.stringify(search_location)
      }
      return search_location
    },
    getHumanSearchCategory() {
      var search_category = this.filterParams["category"];
      if(search_category){
        search_category = JSON.stringify(search_category)
      }
      return search_category
    },
    getUriFromState() {
      var uri_components = []
      const search_term = this.getHumanSearchTerm()
      const search_location = this.getHumanSearchLocation()
      const search_category = this.getHumanSearchCategory()
      if (search_term) {
        uri_components.push('q=' + encodeURIComponent(search_term))
      }
      if(search_location){
        uri_components.push('loc=' + encodeURIComponent(search_location))
      }
      if(search_category){
        uri_components.push('cat=' + encodeURIComponent(search_category))
      }
      return '/?' + uri_components.join('&')
    },
    trackSearchQuery() {
      var params = Object.assign({}, this.filterParams);
      if(!params){ return }
      const path = this.getUriFromState();
      window.history.pushState(params, document.title, path);
      this.$gtag.pageview({page_path: path});
      this.$gtag.event('searchQueryParams', JSON.stringify(params));
      this.$gtag.event('searchQuery', params);
      const search_term = this.getHumanSearchTerm()
      const search_location = this.getHumanSearchLocation()
      const search_category = this.getHumanSearchCategory()
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
      this.showResults = true
      this.refreshResults();
      this.trackSearchQuery();
    }
  }
};

function sortOrgsByDistance(results, regionCoords, ourLocation) {
  const ruler = cheapRuler(ourLocation[1]);
  function distance(location) {
    return ruler.distance(location, ourLocation);
  }

  /* For now we are just using centroids of LGAs. */
  function resultCoord(result) {
    const response = [result.long, result.lat]
    return response
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

<style scoped>

#results {
  padding: 20px;
}

#hits {
  font-weight: bolder;
  font-size: large;
}

</style>