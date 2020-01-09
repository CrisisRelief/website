<template>
  <div class="search-result-container">
    <hr />
    <a v-if="link.length > 0" href="link">
      <h1>{{ title }}</h1>
    </a>
    <h1 v-else>{{ title }}</h1>
    <div class="search-result-meta">
      <div class="search-result-categories">
        <span v-for="(category, index) in categories" :key="index" class="search-result-category">
          {{ category }}
          <span v-if="index+1 < categories.length">/</span>
        </span>
      </div>
      <div class="search-result-location">{{ location }}</div>
    </div>
    <div class="search-result-description" v-html="description"></div>
    <div class="search-result-contact">
      <div v-for="(value, key, index) in contact" :key="index">
        <a v-if="key == 'phone'" :href="`tel:${ value }`">
          <FontAwesomeIcon icon="phone-square-alt" />
          {{ value }}
        </a>
        <a v-if="key == 'website'" :href="value">
          <FontAwesomeIcon icon="address-card" />Visit Website
        </a>
        <a v-if="key == 'email'" :href="`mailto:${ value }`">
          <FontAwesomeIcon icon="envelope-square" />
          {{ value }}
        </a>
        <a v-if="key == 'address'" href="#">
          <FontAwesomeIcon icon="directions" />
          {{ value }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  props: {
    title: {},
    categories: {},
    location: {},
    description: {},
    contact: {},
    link: {
      default: ""
    }
  },
  components: { FontAwesomeIcon }
};
</script>

<style scoped>

h1 {
  font-size: 20px;
  font-weight: 600; /* semibold */
  text-transform: uppercase;
}

.search-result-meta,
.search-result-contact {
  font-weight: 600; /* semibold */
}
</style>
