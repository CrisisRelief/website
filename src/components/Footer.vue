<template>
  <footer id="footer" class="footer">
    <div class="container">
        <p>Disclaimer: We are volunteers. We try for accuracy, but listings may have errors or out-dated information. Please make sure to personally verify information. </p>
        <ul class="list-inline">
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
    </div>
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
  background:#f5f5f5;
  padding:20px 0 40px;
}
</style>
