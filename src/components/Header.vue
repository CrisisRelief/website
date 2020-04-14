<template>
<header>
    <nav class="navbar navbar-light bg-light">
      <h1 class="navbar-brand mb-0">
        <a href="/" style="border:none"><img src="/images/logo.png" alt="Crisis App"></a>
      </h1>
      <!-- <div style="text-align:center" class="alert alert-primary w-100" role="alert">
          This website is still under active development, go-live should only be a few hours away &lt;3
      </div> -->
      <div id="links" class="menu" role="navigation">
        <Slide right>
          <router-link to="/">Search</router-link>
          <a href="https://crisis.app/our-story">About</a>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSc_MjrlaZ89Wc2vn_XleAjOoJUZayKNGCTzeX5xNY-xPMDFkg/viewform">Submit a Resource</a>
          <a href="https://firemap.atlassian.net/servicedesk/customer/portal/2">Support Portal</a>
          <a href="https://crisis.app/our-story/contributors">Contributors</a>
        </Slide>
      </div>
    </nav>
</header>
</template>

<script>
import { Slide } from 'vue-burger-menu'
export default {
  components: {
    Slide
  }
}
</script>

<style scoped>
header {
  margin-bottom:30px;
}
nav h1 {
  font-size: xx-large;
  font-weight: bold;
}
nav h1 img {
    max-width:250px;
}
#header-start {
  color: #02909e;
}
#header-end {
  color: #384b71;
}
.bm-item-list a {
  color: #fff;
}

</style>
<style>
.bm-overlay {
    background:none;
}
.bm-overlay::before {
    content: "";
    background: #000;
    opacity: 0.7;
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 9;
}
.menu .bm-burger-button {
    height:20px;
    top:25px;
}
.menu .bm-burger-button .bm-burger-bars {
    background: #02909e;
    border-radius: 45px;
}
.bm-item-list .bm-menu a:hover {
    color:#fff;
}
</style>
