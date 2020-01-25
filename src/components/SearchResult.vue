<template>
  <div class="search-result-container">
    <hr />
    <a v-if="link.length > 0" :href="link">
      <h3>{{ title }}</h3>
    </a>
    <h3 v-else>{{ title }}</h3>
    <div class="search-result-meta">
      <div class="search-result-categories">
        <span v-for="(category, index) in categories" :key="index" class="search-result-category">
          {{ category }}
          <span v-if="index+1 < categories.length"> > </span>
        </span>
      </div>
      <div class="search-result-location">{{ location }}</div>
    </div>
    <div class="search-result-description" v-html="description"></div>
    <table v-if="Object.entries(contact).length" class="search-result-contact table table-borderless my-2">
      <tr v-for="(item, key, index) in contact" :key="index">
        <a v-if="key == 'phone'" :href="`tel:${ item.href }`">
          <td class="py-0 px-2 h5"><FontAwesomeIcon icon="phone-square-alt" /></td>
          <td class="py-0 px-2">{{ item.human }}</td>
        </a>
        <a v-if="key == 'link'" :href="item.href">
          <td class="py-0 px-2 h5"><FontAwesomeIcon icon="address-card" /></td>
          <td class="py-0 px-2">Visit Website</td>
        </a>
        <a v-if="key == 'email'" :href="`mailto:${ item.href }`">
          <td class="py-0 px-2 h5"><FontAwesomeIcon icon="envelope-square" /></td>
          <td class="py-0 px-2">{{ item.human }}</td>
        </a>
        <a v-if="key == 'address'" :href="item.href">
          <td class="py-0 px-2 h5"><FontAwesomeIcon icon="directions" /></td>
          <td class="py-0 px-2">Get Directions</td>
        </a>
      </tr>
    </table>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  props: {
    title: {},
    category: {},
    tags_flat: {},
    location: {},
    description: {},
    phone: {},
    email: {},
    address: {},
    link: {
      default: ""
    }
  },
  components: { FontAwesomeIcon },
  computed: {
    categories() {
      return [this.category, this.tags_flat].filter(
        (elem) => {
          return elem !== undefined && elem.length > 0;
        }
      );
    },
    contact() {
      return ["phone", "email", "address", "link"].reduce((contact, attr) => {
        var human = this[attr]
        var href=human
        if(human) {
          if(attr == "phone") {
            href = human.replace(/[^0-9]/, '');
          }
          if(attr == "address") {
            href = 'http://maps.google.com/?q=' + encodeURI(human);
          }
          contact[attr] = {
            href: href,
            human: human
          }
        }
        return contact;
      }, {});
    }
  }
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
  word-wrap: break-word;
}
</style>
