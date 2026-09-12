import { officialCtoInterviewNav } from "./officialCtoInterviewNav";

const normalizePath = (path: string) =>
  path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;

export const officialCtoMigratedPathPrefixes = [
  ...officialCtoInterviewNav.map(item => item.href),
  "/interview/software-engineering/v1",
  "/engineering/case-studies/v1",
  "/blogs/officialcto/v1",
];

export const isOfficialCtoMigratedPath = (pathname: string) => {
  const currentPath = normalizePath(pathname);

  return officialCtoMigratedPathPrefixes.some(prefix => {
    const normalizedPrefix = normalizePath(prefix);
    return (
      currentPath === normalizedPrefix ||
      currentPath.startsWith(`${normalizedPrefix}/`)
    );
  });
};
