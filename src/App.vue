<template>
  <div id="app">
    <Header />
    <SearchPage />
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import SearchPage from "./components/SearchPage.vue";

export default {
  name: "app",
  components: {
    Header,
    SearchPage,
    Footer
  },
}


</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap");

body div {
  text-align: left;
  color: #1b2a49; /* Navy */
  font-size: 14px;
}

.content-wrap {
  padding-bottom: 2.5rem;
}

#app {
  font-family: "Source Sans Pro", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  position: relative;
  min-height: 100vh;
}

body a {
  color: #02909e; /* Turquoise */
}
</style>
