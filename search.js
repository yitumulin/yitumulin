document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("searchInput");
  const searchResultsDiv = document.getElementById("searchResults");
  let searchIndex;
  let documents = [];

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
        documents.forEach(function(doc) {
          this.add(doc);
        }, this);
      });
    } catch (error) {
      console.error("Search index init failed:", error);
      searchResultsDiv.innerHTML = "<p>搜索暂不可用，请稍后重试。</p>";
    }
  }

  function displayResults(resultsFromLunr) {
    searchResultsDiv.innerHTML = "";

    if (!resultsFromLunr || resultsFromLunr.length === 0) {
      searchResultsDiv.innerHTML = "<p>没有找到匹配内容。</p>";
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
      a.textContent = doc.title;
      li.appendChild(a);

      if (doc.date) {
        const dateSpan = document.createElement("span");
        dateSpan.textContent = doc.date;
        li.appendChild(dateSpan);
      }

      ul.appendChild(li);
    });

    searchResultsDiv.appendChild(ul);
  }

  searchInput.addEventListener("keyup", function(event) {
    const query = event.target.value.trim();

    if (!searchIndex) {
      searchResultsDiv.innerHTML = "<p>搜索索引正在初始化，请稍候。</p>";
      return;
    }

    if (!query) {
      searchResultsDiv.innerHTML = "";
      return;
    }

    try {
      const lunrResults = searchIndex.search(query);
      displayResults(lunrResults);
    } catch (error) {
      console.error("Search failed:", error);
      searchResultsDiv.innerHTML = "<p>搜索发生错误，请换个关键词重试。</p>";
    }
  });

  loadSearchDataAndBuildIndex();
});
