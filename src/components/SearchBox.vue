<template>
  <div class="container">
    <div class="intro">
      <h2>Find Resources Near You</h2>
      <p>In a natural disaster emergency we help you find the help you need. Listings may have errors or out-dated information, please verify services with the poster.</p>
    </div>
    <div class="search form">
      <h3>Search</h3>

      <div class="row no-gutter">
        <!-- Search Term Input -->
        <div class="col-12 col-md-10 form-item">
          <input
            type="text"
            class="form-control"
            v-model="search_term"
            placeholder="What do you need? eg. food, fuel"
          />
        </div>
      </div>

      <div class="row no-gutter">
        <!-- Location Selection -->
        <div class="col-12 col-sm-4 form-item">
          <multiselect
            v-model="search_location"
            :options="search_locations"
            label="value"
            track-by="value"
            placeholder="Local Government Area"
          />
        </div>

        <!-- Category -->
        <div class="col-12 col-sm-4 form-item">
          <multiselect
            v-model="search_category"
            :options="search_categories"
            label="value"
            track-by="value"
            placeholder="Category"
          />
        </div>

        <!-- Submit Button -->
        <div class="col-12 col-sm-3 form-submit">
          <button type="button" class="btn btn-info" v-on:click="onClickSearch">Search</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  components: { Multiselect },
  props: {
    search_locations: { },
    search_categories: { }
  },
  data() {
    return {
      search_term: "",
      search_location: null,
      search_category: null
    };
  },
  methods: {
    onClickSearch(event) {
      this.$emit("updated", {
        search_location: this.search_location,
        search_category: this.search_category,
        search_term: this.serach_term
      });
    }
  }
};
</script>

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
.multiselect__option--highlight:after {
  background: #02909e !important;
}
.multiselect__option--highlight {
  background: #02909e !important;
}
@media screen and (max-width: 575px) {
  .search.form .form-item + .form-item,
  .search.form .form-item + .form-submit {
    margin-left: 0;
  }
}
</style>
