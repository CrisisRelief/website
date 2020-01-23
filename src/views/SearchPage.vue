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
        :loading="loading"
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
        :tags_flat="result.tags_flat"
        :location="result.address"
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
        category: null,
        location: null
      },
      filterOptions: {
        categories: [],
        locations: []
      },
      showResults: false,
      loading: {
        category: true,
        location: true
      }
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
        this.loading.location = false
      }),
      axios.get(this.orgJSONURI).then(response => {
        console.log("loading org json from", this.orgJSONURI);
        this.rawData = response.data.map(this.parseSingleRawOrg)
        this.refreshCatFilterOptions();
        this.loading.category = false
      })
    ]
    async function callAfterAwait(promises, cb) {
      await Promise.all(promises)
      cb()
    }
    callAfterAwait(promises, this.refreshResults)
  },
  methods: {
    parseSingleRawOrg(org) {
      // console.log(`org ${JSON.stringify(org)}`)
      const defaults = {subcategory_1: '', subcategory_2: '', other_categories: '' }
      const {subcategory_1, subcategory_2, other_categories} = Object.assign(defaults, org)
      var tags = []
      Array(subcategory_1, subcategory_2).forEach((subcategory) => {
        tags.push(...subcategory.split(', '))
      })
      org.tags = tags.filter(tag => { return tag.length > 0 })
      org.tags_flat = org.tags.concat(other_categories).filter(
        (tag) => {return tag.length > 0}
      ).join(', ')

      return org
    },
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
      const categories = {};
      this.rawData.forEach(org => {
        if (org.category && !Object.keys(categories).includes(org.category)) {
          categories[org.category] = []
        }
        if (org.tags && org.tags instanceof Array) {
          org.tags.forEach((tag) => {
            if(tag && !categories[org.category].includes(tag)) {
              categories[org.category].push(tag)
            }
          })
        }
      })
      // console.log(`categories ${JSON.stringify(categories)}`)
      const category_options = Object.entries(categories).map((entry) => {
        const [category, children] = entry
        var subcategories = children.map((tag) => { return { category, tag } })
        if (subcategories.length == 0) {
          subcategories = Array({category, tag: ''})
        }
        return {
          category,
          subcategories
        }
      })
      // console.log(`category_options ${JSON.stringify(category_options)}`)
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
        const [location, children] = entry
        var sub_locations = children.map((child) => {
          return { location, ...child }
        })
        return {
          location,
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
        categories = search_category.filter((category)=>{
          return Object.entries(category).length > 0
        })
        if (!categories.length > 0) { return orgs }
      } else {
        if (!Object.entries(search_category).length) { return orgs }
        categories = [search_category]
      }

      let result = orgs.filter(org => {
        return this.orgInCategories(org, categories)
      });

      // console.log(`result ${JSON.stringify(result)}`)
      return result
    },
    orgInCategories(org, categories) {
      var result = false
      categories.forEach((category_spec) => {
        if (!category_spec || !Object.entries(category_spec).length) { return }
        if (category_spec.category && org.category != category_spec.category) { return }
        if (category_spec.tag && !org.tags.includes(category_spec.tag)) { return }
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
            "tags_flat",
            "location",
            "lga",
            "description",
            "phone",
            "email",
            "address",
            "link"
          ],
          shouldSort: true,
          // tokenize: true,
          threshold: 0.3
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
