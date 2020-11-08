<template>
  <div>
    <nav class="main-nav">
      <b-nav>
        <b-nav-item href="https://zacharyseguin.ca"><img src="./assets/icon.svg" alt="Zachary Seguin" class="icon" /></b-nav-item>
        <!--<b-nav-item to="/" active-class="active" exact>Home</b-nav-item>-->
        <b-nav-item to="/for-you" active-class="active" exact>For you</b-nav-item>
        <b-nav-item-dropdown text="Active">
          <b-dropdown-item to="/active/canada" active-class="active">Canada</b-dropdown-item>
          <b-dropdown-item to="/active/united-states" active-class="active">United States</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item to="/about" active-class="active" exact>About</b-nav-item>
      </b-nav>
    </nav>
    <b-container>
      <b-row class="content w-100">
        <keep-alive><router-view/></keep-alive>
      </b-row>
    </b-container>
    <footer class="mt-4">
      <p class="text-center text-small text-muted">Copyright &copy; 2020 &mdash; <a href="https://zacharyseguin.ca">Zachary Seguin</a>
      <br />
      Source code available at <a href="https://github.com/alerting">github.com/alerting</a></p>
    </footer>
  </div>
</template>

<style lang="scss">
@import "@/assets/_custom.scss";
//@import "~bootswatch/dist/flatly/variables";
@import "~bootswatch/dist/darkly/variables";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index.scss";

.text-small {
  font-size: 0.9rem;
}

a.disable-link {
  color: inherit;
  text-decoration: none;
}

$nav-fg: $gray-500;
.main-nav {
  min-width: 100%;
  text-align: center;
  background: $gray-800;
  color: $nav-fg;
  padding: 0;
  display: flex;
  justify-content: center;
  font-size: 0.9rem;
  line-height: 45px;
  font-size: 0.9rem;
  border-bottom: 1px solid darken($gray-900, 2%);

  a, a:hover, a:focus, {
    color: inherit;
    text-decoration: none;
  }

  a.primary {
    color: $primary !important;
  }

  a:hover {
    color: lighten($nav-fg, 15%);
  }

  .active {
    color: lighten($nav-fg, 15%) !important;
    font-weight: bold;
  }

  .nav-link {
    padding: 0.5rem 0.5rem;
    margin: 0;
  }
}
</style>

<style lang="scss" scoped>
@import "@/assets/_custom.scss";
@import "~bootswatch/dist/darkly/variables";
$nav-bg: $black;
$nav-fg: $gray-500;

.icon {
  width: 45px;
  height: 45px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, .6);
  border-radius: 2px;
  margin-right: 10px;
}

.content {
  padding-top: 30px;
}
</style>
