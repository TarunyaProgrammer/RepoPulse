export interface GitHubPayload {
  repository: {
    name: string;
    full_name: string;
    html_url: string;
  };
  sender: {
    login: string;
  };
  [key: string]: any;
}

export interface PushEvent extends GitHubPayload {
  commits: any[];
  after: string;
}

export interface PullRequestEvent extends GitHubPayload {
  action: string;
  pull_request: {
    number: number;
    title: string;
    state: string;
  };
}

export interface ReleaseEvent extends GitHubPayload {
  action: string;
  release: {
    tag_name: string;
    name: string;
  };
}
