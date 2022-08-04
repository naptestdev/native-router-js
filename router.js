const routes = {
  "/": {
    body: "./routes/home.html",
  },
  "/about": {
    body: "./routes/about.html",
  },
  "/dynamic/:id": {
    body: "./routes/dynamic.html",
  },
};

const isMatchRoute = (route, pathname) => {
  const parsed = route.replace(/\/:[^\/]+/gm, "/[^\\/]+");

  const regex = new RegExp(`^${parsed}\\/?$`, "gm");
  const isMatching = regex.test(pathname);

  let params = {};

  if (isMatching) {
    const routeMatches = route.match(/\/[^\\\/]+/gm) || [];
    const pathnameMatches = pathname.match(/\/[^\\\/]+/gm) || [];

    for (const [index, routeMatch] of routeMatches.entries()) {
      if (routeMatch.startsWith("/:")) {
        params[routeMatch.slice(2)] = pathnameMatches[index].slice(1);
      }
    }
  }

  return { isMatching, params };
};

let params = {};

const renderRoute = () => {
  let hasMatched = false;
  for (const route in routes) {
    const { isMatching, params: loadedParams } = isMatchRoute(
      route,
      location.hash ? location.hash.slice(1) : "/"
    );

    if (isMatching) {
      hasMatched = true;
      params = loadedParams;
      fetch(routes[route].body)
        .then((res) => res.text())
        .then((html) => {
          document.body.innerHTML = "";
          document.body.append(
            document.createRange().createContextualFragment(html)
          );
        });
      break;
    }
  }
  if (!hasMatched) document.body.innerHTML = `404`;
};
renderRoute();

window.addEventListener("hashchange", () => {
  renderRoute();
});
