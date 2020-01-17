<template>
  <div class="content-wrap">
    <div class="container">
      <div class="intro">
          <h2>Need help or want to help?</h2>
          <p>Use the directory to find resources or services you need in an emergency, or where and how you can help.<p>
          <p>If you have a resource or service to offer, add a listing using our <a href="https://docs.google.com/forms/d/e/1FAIpQLSc_MjrlaZ89Wc2vn_XleAjOoJUZayKNGCTzeX5xNY-xPMDFkg/viewform">online form</a>.</p>
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
      <p>Note: While every effort is being made to ensure the information is accurate, this is a community-sourced directory. Please do your own checks.</p>
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
  computed: {
    searchTermString() {
      return this.filterParams["term"];
    },
    searchLocationString() {
      var search_location = this.filterParams["location"];
      if(search_location){
        search_location = JSON.stringify(search_location)
      }
      return search_location
    },
    searchCategoryString() {
      var search_category = this.filterParams["category"];
      if(search_category){
        search_category = JSON.stringify(search_category)
      }
      return search_category
    },
  },
  mounted() {
    this.checkUri();
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
      const href = window.location.href;
      const queryStr = href.split('?')[1];
      if (!queryStr) { return }
      // console.log(`queryStr ${queryStr}`)
      let queryParams = queryStr.split('&').reduce((result, hash) => {
        // console.log(`hash ${hash}`)
        let [key, val] = hash.split('=')
        result[key] = unescape(val)
        return result
      }, {})

      Object.entries({
        q: {filterKey: 'term', parse: false},
        loc: {filterKey: 'location', parse: true},
        cat: {filterKey: 'category', parse: true}
      }).forEach(([queryKey, {filterKey, parse}]) => {
        if (queryParams[queryKey]) {
          this.filterParams[filterKey] = parse ? JSON.parse(queryParams[queryKey]) : queryParams[queryKey]
        }
      })
    },
    refreshCatFilterOptions() {
      // TODO: rewrite with lodash
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
            lat: loc.lat,
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
        orgsWithPosition = sortOrgsByDistance(orgsWithPosition, position)
        return orgsWithPosition.concat(orgsWithOutPosition)
      }
      return orgs;
    },
    filterOrgs(orgs) {
      if (!this.filterParams) {
        return orgs;
      }
      const search_category = this.filterParams["category"];
      var categories;
      if (!search_category || search_category == null) {
        return orgs
      } else if (search_category instanceof Array) {
        categories = search_category.filter((category)=>{ Object.entries(category).length })
        if (!categories.length) { return orgs }
      } else {
        if (!Object.entries(search_category).length) { return orgs }
        categories = [search_category]
      }

      let result = orgs.filter(org => {
        if (!this.orgInCategories(org, categories)) {
          return false;
        }
        return true;
      });

      // console.log(`result ${JSON.stringify(result)}`)
      return result
    },
    orgInCategories(org, categories) {
      var result = false
      categories.forEach((category_spec) => {
        if (!category_spec || !Object.entries(category_spec).length) { return }
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
        let result = fuse.search(search_term);
        return result
      }
      return orgs;
    },
    updateWindowLocation() {
      const newQuery = Object.assign({}, this.$route.query)
      const search_term = this.searchTermString
      const search_location = this.searchLocationString
      const search_category = this.searchCategoryString
      if (search_term) {
        newQuery['q'] = search_term
      }
      if(search_location){
        newQuery['loc'] = search_location
      }
      if(search_category){
        newQuery['cat'] = search_category
      }
      this.$router.replace({
        query: newQuery
      })
    },
    trackSearchQuery() {
      this.$gtag.pageview({page_path: window.location.href});
    },
    onSearchBoxUpdate(params) {
      console.log("onSearchBoxUpdate", JSON.stringify(params));
      this.filterParams = params;
      this.showResults = true
      this.refreshResults();
      this.updateWindowLocation();
      this.trackSearchQuery();
    }
  }
};

function sortOrgsByDistance(results, ourLocation) {
  // console.log(`sortOrgsByDistance ${JSON.stringify(results)} ${JSON.stringify(ourLocation)}`)
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
