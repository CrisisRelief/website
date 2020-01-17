<template>
<header>
    <nav class="navbar navbar-light bg-light">
      <h1 class="navbar-brand mb-0">
        <a href="/" style="border:none"><img src="<%= BASE_URL %>images/logo.png" alt="Crisis App"></a>
      </h1>
      <!-- <div style="text-align:center" class="alert alert-primary w-100" role="alert">
          This website is still under active development, go-live should only be a few hours away &lt;3
      </div> -->
      <div class="menu-toggle" aria-label="click here to open the menu"><span></span><span></span><span></span></div>
      <div id="links" class="menu" role="navigation">
        <ul>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/">Search</router-link></li>
          <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSc_MjrlaZ89Wc2vn_XleAjOoJUZayKNGCTzeX5xNY-xPMDFkg/viewform">Submit a Resource</a></li>
        </ul>
      </div>
    </nav>
</header>
</template>

<style scoped>
header {
  margin-bottom:30px;
}
nav h1 {
  font-size: xx-large;
  font-weight: bold;
}

#header-start {
  color: #02909e;
}
#header-end {
  color: #384b71;
}
.menu-toggle {
    position: absolute;
    right: 30px;
}
.menu-toggle span {
    height: 4px;
    width: 35px;
    background: #02909e;
    display: block;
    margin-bottom: 4px;
    border-radius: 45px;
}
.menu {
    background: #f8f9fa;
    display:none;
    padding: 10px 30px;
    position: absolute;
    right: 15px;
    text-align: left;
    top: 100%;
}
</style>
