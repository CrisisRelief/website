<template>
  <div id="app">
    <Header />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "app",
  components: {
    Header,
    Footer
  },
  computed: {
    fragment() {
      console.log(this.$route.params);
      return this.$route.params;
    }
  }
};


</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap");
@import '../node_modules/@fortawesome/fontawesome-pro/css/all.css';

#app {
  font-family: "Source Sans Pro", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  position: relative;
  min-height: 100vh;
}

body div {
  text-align: left;
  color: #1b2a49; /* Navy */
  font-size: 14px;
}

body a {
  color: #02909e; /* Turquoise */
}
</style>
