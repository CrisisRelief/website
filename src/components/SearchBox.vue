<template>
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
            v-on:keyup.enter="onClickSearch"
          />
        </div>
      </div>

      <div class="row no-gutter">
        <!-- Location Selection -->
        <div class="col-12 col-sm-4 form-item">
          <multiselect
            v-model="search_location"
            :options="search_locations"
            :multiple="true"
            placeholder="Location"
          />
        </div>

        <!-- Category -->
        <div class="col-12 col-sm-4 form-item">
          <multiselect
            v-model="search_category"
            :options="search_categories"
            :multiple="true"
            placeholder="Category"
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
    onClickSearch() {
      this.$emit("updated", {
        search_location: this.search_location,
        search_category: this.search_category,
        search_term: this.search_term
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
@media screen and (max-width: 575px) {
  .search.form .form-item + .form-item,
  .search.form .form-item + .form-submit {
    margin-left: 0;
  }
}
</style>
<style>
.search.form .multiselect__element {
  display:block;
}
.search.form .multiselect__element .multiselect__option {
  background: none;
  display:block;
  padding:10px 40px 10px 30px;
  white-space:normal;
}
.search.form .multiselect__element .multiselect__option.multiselect__option--group {
    background:none;
    color: #02909e;
    padding-left:20px;
}
.search.form .multiselect__input:focus {
  border-bottom: 2px solid #02909e;
  padding:0;    
}
.search.form .multiselect__option--highlight:after {
  background: #02909e !important;
}
.search.form .multiselect__option--highlight {
  background: #02909e !important;
  color:#fff !important;
}
.search.form .multiselect__option--highlight::after {
    background:none!important;
    content: "";
}
.search.form .multiselect__option--selected.multiselect__option--highlight::after {
    content: "\f00d";
    font-family: "Font Awesome 5 Pro";
    margin-right: 2px;
}
.search.form .multiselect__option--selected::after {
    content: "\f00c";
    font-family: "Font Awesome 5 Pro";
}
</style>