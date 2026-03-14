import json
import os
from collections import defaultdict

import requests

GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"


def run_query(token: str, query: str, variables: dict) -> dict:
    headers = {"Authorization": f"bearer {token}"}
    response = requests.post(
        GITHUB_GRAPHQL_URL,
        json={"query": query, "variables": variables},
        headers=headers,
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    if "errors" in data:
        raise RuntimeError(f"GraphQL errors: {data['errors']}")
    return data


def fetch_languages(token: str, username: str) -> dict[str, int]:
    query = """
    query($login: String!, $after: String) {
      user(login: $login) {
        repositories(
          first: 100
          after: $after
          ownerAffiliations: [OWNER]
          privacy: PUBLIC
          isFork: false
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            primaryLanguage {
              name
            }
          }
        }
      }
    }
    """
    lang_counts: dict[str, int] = defaultdict(int)
    after = None

    while True:
        data = run_query(token, query, {"login": username, "after": after})
        repos = data["data"]["user"]["repositories"]
        for repo in repos["nodes"]:
            if repo["primaryLanguage"] is not None:
                lang_counts[repo["primaryLanguage"]["name"]] += 1
        page_info = repos["pageInfo"]
        if not page_info["hasNextPage"]:
            break
        after = page_info["endCursor"]

    return dict(lang_counts)


def fetch_commits(token: str, username: str) -> int:
    headers = {
        "Authorization": f"bearer {token}",
        "Accept": "application/vnd.github.cloak-preview",
    }
    params = {"q": f"author:{username} committer-date:2026-01-01..2026-12-31", "per_page": 1}
    response = requests.get(
        "https://api.github.com/search/commits",
        headers=headers,
        params=params,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["total_count"]


def fetch_pull_requests(token: str, username: str) -> int:
    query = """
    query($query: String!) {
      search(query: $query, type: ISSUE, first: 1) {
        issueCount
      }
    }
    """
    search_query = f"author:{username} type:pr created:2026-01-01..2026-12-31"
    data = run_query(token, query, {"query": search_query})
    return data["data"]["search"]["issueCount"]


def fetch_issues(token: str, username: str) -> int:
    query = """
    query($query: String!) {
      search(query: $query, type: ISSUE, first: 1) {
        issueCount
      }
    }
    """
    search_query = f"author:{username} type:issue created:2026-01-01..2026-12-31"
    data = run_query(token, query, {"query": search_query})
    return data["data"]["search"]["issueCount"]


def compute_proportions(lang_counts: dict[str, int]) -> list[dict]:
    total = sum(lang_counts.values())
    if total == 0:
        return []
    proportions = [
        {"name": lang, "proportion": round(count / total, 2)}
        for lang, count in lang_counts.items()
        if count > 0
    ]
    proportions.sort(key=lambda x: x["proportion"], reverse=True)
    # Filter out zero proportions after rounding
    proportions = [p for p in proportions if p["proportion"] > 0]
    return proportions


def main():
    username = os.environ.get("GH_USERNAME")
    token = os.environ.get("GH_TOKEN")
    if not username or not token:
        raise RuntimeError("GH_USERNAME and GH_TOKEN environment variables must be set")

    lang_counts = fetch_languages(token, username)
    commits = fetch_commits(token, username)
    pull_requests = fetch_pull_requests(token, username)
    issues = fetch_issues(token, username)

    languages = compute_proportions(lang_counts)

    result = {
        "languages": languages,
        "commits": commits,
        "pull_requests": pull_requests,
        "issues": issues,
    }

    output_path = os.path.join(os.path.dirname(__file__), "data.json")
    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)

    print(f"Written to {output_path}")


if __name__ == "__main__":
    main()
