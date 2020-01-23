<template>
    <div class="search form">
      <h3>Search</h3>

      <div class="row no-gutter">
        <!-- Search Term Input -->
        <div class="col-12 col-md-10 form-item">
          <input
            type="text"
            class="form-control"
            v-model="value.term"
            placeholder="What do you need? eg. food, fuel"
            v-on:keyup.enter="onClickSearch"
          />
        </div>
      </div>

      <div class="row no-gutter">
        <!-- Location Selection -->
        <div class="col-12 col-sm-4 form-item">
          <multiselect
            v-model="value.location"
            :options="comp_location_options"
            :group-select="true"
            :loading="loading.location"
            group-values="sublocations"
            group-label="location"
            label="location"
            :custom-label="locationLabel"
            placeholder="Location"
            :show-labels="false"
          >
            <template slot="beforeList">
              <button v-if="has_geolocation" type="button" class="btn btn-info" v-on:click="onToggleLocation">
                <span v-if="!useBrowserLocation">Use my current location</span>
                <span v-else>Search for a location</span>
              </button>
            </template>
          </multiselect>
        </div>

        <!-- Category -->
        <div class="col-12 col-sm-4 form-item">
          <multiselect
            :value="value.category"
            :options="category_options"
            :group-select="true"
            :loading="loading.category"
            group-values="subcategories"
            group-label="category"
            label="concat"
            :custom-label="categoryLabel"
            placeholder="Category"
            :show-labels="false"
            :multiple="true"
            :close-on-select="false"
            :reset-after="true"
            @select="onSelectCategory"
            @remove="onRemoveCategory"
          />
        </div>

        <!-- Submit Button -->
        <div class="col-12 col-sm-3 form-submit">
          <button type="button" class="btn btn-info" v-on:click="onClickSearch">Search</button>
        </div>
      </div>
    </div>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  components: { Multiselect },
  props: {
    location_options: { },
    category_options: { },
    value: {
      type: Object,
      default() {
        return {
          location: null,
          term: "",
          category: null
        }
      }
    },
    loading: {
      default() {
        return {
          category: true,
          location: true
        }
      }
    },
  },
  data() {
    return {
      useBrowserLocation: false,
    }
  },
  computed: {
    comp_location_options() {
      if (this.useBrowserLocation) {
        return []
      }
      return this.location_options
    },
    has_geolocation() {
      return navigator.geolocation
    }
  },
  methods: {
    onSelectCategory(selectCat) {
      var selectCats = [selectCat]
      if (selectCat instanceof Array) {
        selectCats = selectCat
      }
      if( this.value.category == null) {
        this.value.category = []
      }
      selectCats.forEach((selectCat) => {
        if (! this.value.category.includes(selectCat)) {
          this.value.category.push(selectCat)
        }
      })
    },
    onRemoveCategory(removeCat) {
      var removeCats = [removeCat]
      if (removeCat instanceof Array) {
        removeCats = removeCat
      }
      this.value.category = this.value.category.filter((cat) => {
        var result = true
        removeCats.forEach((removeCat) => {
          if (JSON.stringify(cat) === JSON.stringify(removeCat)) { result = false }
        })
        return result
      })
    },
    onClickSearch() {
      this.$emit("updated", this.value);
    },
    onToggleLocation() {
      this.useBrowserLocation = !this.useBrowserLocation
      if (this.useBrowserLocation) {
        this.value.location = [{"currentLocation":true}]
      }
    },
    locationLabel(location) {
      if (location.currentLocation) {
        return 'Use my current location'
      }
      const components = []
      if (location.postcode) {
        // components.push('<pre class="location-postcode">' + location.postcode + "<pre/>")
        components.push(location.postcode)
      }
      if (location.locality) {
        // components.push('<pre class="location-locality">' + location.locality + "<pre/>");
        components.push(location.locality)
      }
      return components.join(' - ')
      // return location.locality
    },
    categoryLabel(category) {
      if (category.tag && category.tag.length > 0) {
        return category.tag
      }
      return category.category
    }
  }
};
</script>

<style>
@import '../../node_modules/@fortawesome/fontawesome-pro/css/all.css';
</style>

<style scoped>

.row.no-gutter {
  margin: 0;
}
.form-control {
  height: 43px !important;
}
.btn-info {
  width: 100%;
  height: 43px;
}
.search.form {
  background-color: #384b71;
  padding: 10px 15px;
}
.search.form h3 {
  color: #fff;
  margin: 0 0 15px 0;
}
.search.form .form-item,
.search.form .form-submit {
  margin-bottom: 15px;
  padding: 0;
}
.search.form .form-item + .form-item,
.search.form .form-item + .form-submit {
  margin-left: 15px;
}
@media screen and (max-width: 575px) {
  .search.form .form-item + .form-item,
  .search.form .form-item + .form-submit {
    margin-left: 0;
  }
}

</style>
<style>

.search.form .multiselect__input {
  border-bottom: 2px solid #02909e;
  padding:0;
}

/* .search.form .multiselect__single {
  display: none;
} */

.search.form .multiselect__option--highlight,
.search.form .multiselect__option--highlight:after {
  background: #02909e;
}

.search.form .multiselect__content,
.search.form .multiselect__element,
.search.form .multiselect__option {
  width: 100%
}

.search.form .multiselect__option span {
  display: block;
  width: 100%;
  word-break: break-word;
  white-space: normal;
}

.search.form .multiselect__option--group-selected::after,
.search.form .multiselect__option--selected::after {
  content: "\f00d";
  font-family: "Font Awesome 5 Pro";
  margin-right: 2px;
}

.search.form .multiselect__option--highlight:not(.multiselect__option--selected):not(.multiselect__option--group-selected)::after {
  content: "\f00c";
  font-family: "Font Awesome 5 Pro";
}
</style>
