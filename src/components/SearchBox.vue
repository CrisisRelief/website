<template>
  <div class="container-fluid color-background pb-3">
    <h5 class="text-center mb-0 text-white py-4">Search for organisations</h5>

    <div class="row">
      <!-- Need Input -->
      <div class="col-12">
        <input
          type="text"
          class="form-control"
          v-model="input_need"
          id="search_need"
          placeholder="What do you need? eg. food, fuel"
        />
      </div>

      <!-- LGA Selection -->
      <div class="col-12 mt-3">
        <multiselect v-model="search_lga" :options="search_lgas" label="name" track-by="value" />
      </div>

      <!-- Category -->
      <div class="col-12 mt-3">
        <multiselect
          v-model="search_category"
          :options="search_categories"
          label="display"
          track-by="value"
        />
      </div>

      <!-- Submit Button -->
      <div class="col-12 mt-3">
        <button type="button" class="btn btn-info">FIND ORGANISATIONS</button>
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
.form-control {
  height: 3em !important;
}
.btn-info {
  width: 100%;
  height: 100%;
}
.color-background {
  background-color: #384b71;
}

.multiselect__option--highlight:after {
  background: #02909e !important;
}
.multiselect__option--highlight {
  background: #02909e !important;
}
</style>
