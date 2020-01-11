<template>
  <div class="container">      
      <div class="intro">
          <h2>Find Resources Near You</h2>
          <p>In a natural disaster emergency, we help you find the help you need, or find where and how you can help. </p>
      </div>
      <div class="search form">
        <h3>Search for organisations</h3>

        <div class="row no-gutter">
          <!-- Need Input -->
          <div class="col-12 col-md-10 form-item">
            <input
              type="text"
              class="form-control"
              v-model="input_need"
              id="search_need"
              placeholder="What do you need? eg. food, fuel"
            />
          </div>
        </div>

        <div class="row no-gutter">
          <!-- LGA Selection -->
          <div class="col-12 col-sm-4 form-item">
            <multiselect v-model="search_lga" :options="search_lgas" label="name" track-by="value" />
          </div>

          <!-- Category -->
          <div class="col-12 col-sm-4 form-item">
            <multiselect
              v-model="search_category"
              :options="search_categories"
              label="display"
              track-by="value"
            />
          </div>

          <!-- Submit Button -->
          <div class="col-12 col-sm-3 form-submit">
            <button type="button" class="btn btn-info">Search</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  components: { Multiselect },
  data() {
    return {
      input_need: null,
      search_lga: null,
      search_category: null,
      search_lgas: [
        {
          name: "Ballarat",
          value: 1
        },
        {
          name: "Broken Hill",
          value: 2
        },
        {
          name: "Hepburn",
          value: 3
        },
        {
          name: "Wendouree",
          value: 4
        }
      ],
      search_categories: [
        {
          display: "Any Category",
          valye: "any"
        },
        {
          display: "Supplies",
          value: "supplies"
        },
        {
          display: "Services",
          value: "services"
        }
      ]
    };
  }
};
</script>

<style scoped>
.row.no-gutter {
    margin:0;
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
  padding:10px 15px;
}
.search.form h3 {
    color:#fff;
    margin:0 0 15px 0;
}
.search.form .form-item, .search.form .form-submit {
    margin-bottom:15px;
    padding:0;
}
.search.form .form-item + .form-item, .search.form .form-item +.form-submit {
    margin-left: 15px;
}
.multiselect__option--highlight:after {
  background: #02909e !important;
}
.multiselect__option--highlight {
  background: #02909e !important;
}
@media screen and (max-width:575px) {
    .search.form .form-item + .form-item, .search.form .form-item +.form-submit {
        margin-left: 0;
    }
}
</style>
