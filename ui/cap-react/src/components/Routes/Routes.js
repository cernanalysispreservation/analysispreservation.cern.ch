import Loadable from "react-loadable";
import Loader from "./Loading";

export const DraftsItemIndex = Loadable({
  loader: () => import("../drafts/DraftsItemIndex"),
  loading: Loader
});

export const SearchPage = Loadable({
  loader: () => import("../search/SearchPage"),
  loading: Loader
});

export const PublishedIndex = Loadable({
  loader: () => import("../published/PublishedIndex"),
  loading: Loader
});

export const SettingsIndex = Loadable({
  loader: () => import("../settings"),
  loading: Loader
});

export const WorklflowsIndex = Loadable({
  loader: () => import("../workflows"),
  loading: Loader
});

export const NotFoundPage = Loadable({
  loader: () => import("../errors/404"),
  loading: Loader
});

export const CMSIndex = Loadable({
  loader: () => import("../cms"),
  loading: Loader
});

export const AboutPage = Loadable({
  loader: () => import("../about/AboutPage"),
  loading: Loader
});

export const StatusPage = Loadable({
  loader: () => import("../status/StatusPage"),
  loading: Loader
});

export const HowToSearchPage = Loadable({
  loader: () => import("../about/HowToSearch"),
  loading: Loader
});
