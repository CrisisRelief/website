<template>
  <footer id="footer">
    <ul class="list-inline py-2 pl-4">
      <li class="list-inline-item">
        We
        <FontAwesomeIcon icon="heart" /> Open
      </li>
      <li class="list-inline-item">
        <a
          href="https://opendatacommons.org/licenses/odbl/1.0/"
          target="_blank"
          rel="noopener noreferrer"
        >ODBL</a>
      </li>
      <li class="list-inline-item">
        <a
          href="https://opendatacommons.org/licenses/dbcl/1.0/"
          target="_blank"
          rel="noopener noreferrer"
        >DBCL</a>
      </li>
    </ul>
  </footer>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: { FontAwesomeIcon }
};
</script>

<style scoped>
nav h1 {
  font-size: xx-large;
  font-weight: bold;
}

ul {
  margin: 0 !important;
}

#content {
  color: #384b71;
}

#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
