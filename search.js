document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("searchInput");
  const searchResultsDiv = document.getElementById("searchResults");
  let searchIndex;
  let documents = [];
  let lastResults = [];
  let lastQuery = "";

  if (!searchInput || !searchResultsDiv) return;

  function getLang() {
    if (window.siteI18n && typeof window.siteI18n.getLanguage === "function") {
      return window.siteI18n.getLanguage();
    }
    return "en";
  }

  function t(path, fallback, vars) {
    if (window.siteI18n && typeof window.siteI18n.t === "function") {
      return window.siteI18n.t(path, fallback, vars);
    }
    return fallback;
  }

  function getDocTitle(doc) {
    const lang = getLang();
    if (lang === "zh") {
      return doc.title_zh || doc.title;
    }
    return doc.title;
  }

  function getDocContent(doc) {
    const lang = getLang();
    if (lang === "zh") {
      return doc.content_zh || doc.content;
    }
    return doc.content;
  }

  function simpleSearch(query) {
    const keyword = query.toLowerCase();
    return documents
      .filter(function(doc) {
        return (doc.title || "").toLowerCase().includes(keyword) ||
          (doc.content || "").toLowerCase().includes(keyword) ||
          (doc.title_zh || "").toLowerCase().includes(keyword) ||
          (doc.content_zh || "").toLowerCase().includes(keyword);
      })
      .map(function(doc) {
        return { ref: String(doc.id) };
      });
  }

  async function loadSearchDataAndBuildIndex() {
    try {
      const response = await fetch("search-data.json");
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      documents = await response.json();
      searchIndex = lunr(function() {
        this.ref("id");
        this.field("title", { boost: 10 });
        this.field("content");
        this.field("title_zh");
        this.field("content_zh");
        documents.forEach(function(doc) {
          this.add(doc);
        }, this);
      });
    } catch (error) {
      console.error("Search index init failed:", error);
      searchResultsDiv.innerHTML = "<p>" + t("search.unavailable", "Search is temporarily unavailable. Please try again later.") + "</p>";
    }
  }

  function displayResults(resultsFromLunr) {
    searchResultsDiv.innerHTML = "";
    lastResults = resultsFromLunr || [];

    if (!resultsFromLunr || resultsFromLunr.length === 0) {
      searchResultsDiv.innerHTML = "<p>" + t("search.noResults", "No matching content found.") + "</p>";
      return;
    }

    const ul = document.createElement("ul");
    ul.className = "post-list";

    resultsFromLunr.forEach(function(result) {
      const doc = documents.find(function(item) {
        return item.id.toString() === result.ref;
      });

      if (!doc) return;

      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = doc.url;
      a.textContent = getDocTitle(doc);
      li.appendChild(a);

      if (doc.date) {
        const dateSpan = document.createElement("span");
        dateSpan.textContent = doc.date;
        li.appendChild(dateSpan);
      }

      const excerpt = getDocContent(doc);
      if (excerpt) {
        const p = document.createElement("p");
        p.style.marginTop = "0.6rem";
        p.textContent = excerpt;
        li.appendChild(p);
      }

      ul.appendChild(li);
    });

    searchResultsDiv.appendChild(ul);
  }

  function runQuery(query) {
    let lunrResults = [];
    if (searchIndex) {
      try {
        lunrResults = searchIndex.search(query);
      } catch (error) {
        console.error("Lunr search failed:", error);
      }
    }

    if (!lunrResults.length) {
      lunrResults = simpleSearch(query);
    }

    const uniqueMap = new Map();
    lunrResults.forEach(function(item) {
      if (!uniqueMap.has(item.ref)) {
        uniqueMap.set(item.ref, item);
      }
    });
    return Array.from(uniqueMap.values());
  }

  searchInput.addEventListener("keyup", function(event) {
    const query = event.target.value.trim();
    lastQuery = query;

    if (!searchIndex && !documents.length) {
      searchResultsDiv.innerHTML = "<p>" + t("search.indexLoading", "Search index is still initializing. Please wait a moment.") + "</p>";
      return;
    }

    if (!query) {
      searchResultsDiv.innerHTML = "";
      lastResults = [];
      return;
    }

    try {
      const results = runQuery(query);
      displayResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      searchResultsDiv.innerHTML = "<p>" + t("search.error", "Search failed. Please try a different keyword.") + "</p>";
    }
  });

  document.addEventListener("site-language-changed", function() {
    if (lastQuery && lastResults.length) {
      displayResults(lastResults);
    } else if (lastQuery) {
      const results = runQuery(lastQuery);
      displayResults(results);
    }
  });

  loadSearchDataAndBuildIndex();
});
