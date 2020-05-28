<template>
  <footer id="footer" class="footer">
    <nav id="socials" class="d-flex justify-content-around p-2">
      <span v-for="(social, index) in socials" :key="index" class="m-2 h2">
        <a :aria="social.alt" :href="social.link">
          <i v-bind:class="['fab', social.icon]" />
        </a>
      </span>
    </nav>
    <nav id="license">
      <div class="d-flex justify-content-center px-auto">
        <span class="p-2">
          We <FontAwesomeIcon icon="heart" /> Open
        </span>
        <span class="p-2">
          <a
            href="https://opendatacommons.org/licenses/odbl/1.0/"
            target="_blank"
            rel="noopener noreferrer"
          >ODBL</a>
        </span>
        <span class="p-2">
          <a
            href="https://opendatacommons.org/licenses/dbcl/1.0/"
            target="_blank"
            rel="noopener noreferrer"
          >DBCL</a>
        </span>
      </div>
    </nav>
  </footer>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: { FontAwesomeIcon },
  data() {
    return {
      socials: [
        {
          link: "https://twitter.com/thecrisisapp",
          icon: "fa-twitter-square",
          alt: "twitter"
        },
        {
          link: "https://www.facebook.com/thecrisisapp/",
          icon: "fa-facebook-square",
          alt: "facebook"
        },
        {
          link: "https://www.instagram.com/thecrisisapp",
          icon: "fa-instagram",
          alt: "instagram"
        },
        {
          link: "https://www.linkedin.com/showcase/crisisapp/",
          icon: "fa-linkedin",
          alt: "linkedin"
        }
      ]
    }
  }
};
</script>

<style scoped>

#socials {
  background:#f5f5f5;
}
</style>
