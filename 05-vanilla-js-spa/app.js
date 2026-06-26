import dashboard from "./pages/dashboard.js";
import products from "./pages/products.js";
import posts from "./pages/posts.js";

// 1. display contetn based on the url
function router() {
  const routes = [
    {
      path: "/",
      view: dashboard,
    },
    {
      path: "/products",
      view: products,
    },
    {
      path: "/posts",
      view: posts,
    },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((item) => item.isMatch);
  if (!match) {
    match = {
      route: { path: "/not-found", view: () => console.log("not-found page") },
      isMatch: true,
    };
  }

  document.querySelector("#app").innerHTML = match.route.view();
}

// 2. navigate to a different url
function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

// 3. handle back/forward buttons
window.addEventListener("popstate", router);

// 4. handle link clicks
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]");

    if (link) {
      e.preventDefault();
      navigateTo(link.href);
    }
  });
  router();
});


//5. sidebar toggle
const sidebarToggler = document.querySelector(".sidebar-toggler");
const nav = document.querySelector(".nav");
const root = document.documentElement;
sidebarToggler.addEventListener("click", () => {
  nav.classList.toggle("mini-sidebar");
  if (nav.classList.contains("mini-sidebar")) {
    root.style.setProperty('--nav-width', 70 + 'px');
  }else{
    root.style.setProperty('--nav-width', 250 + 'px');
  }


})