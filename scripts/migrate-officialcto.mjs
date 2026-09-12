import fs from "node:fs";
import path from "node:path";

const sourceRoot = path.resolve(
  process.argv[2] ?? "/Users/ravishankar/personal-work/officialcto"
);
const repoRoot = path.resolve(import.meta.dirname, "..");
const docsRoot = path.join(sourceRoot, "docs");
const interviewSource = path.join(docsRoot, "interview-section");
const interviewTarget = path.join(repoRoot, "src/pages/interview");
const blogPostsTarget = path.join(repoRoot, "src/pages/blogs/_posts");
const layoutsPath = path.join(repoRoot, "src/layouts/DocsLayout.astro");

const titleCase = value =>
  value
    .replace(/\.mdx?$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());

const markdownFiles = directory =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const absolute = path.join(directory, entry.name);
      return entry.isDirectory()
        ? markdownFiles(absolute)
        : entry.isFile() && /\.mdx?$/.test(entry.name)
          ? [absolute]
          : [];
    })
    .sort();

const splitFrontmatter = source => {
  if (!source.startsWith("---\n")) return { frontmatter: [], body: source };
  const delimiter = source.slice(4).match(/\n-{3,}[ \t]*\n/);
  if (!delimiter || delimiter.index === undefined) {
    return { frontmatter: [], body: source };
  }
  const end = delimiter.index + 4;
  return {
    frontmatter: source.slice(4, end).split("\n"),
    body: source.slice(end + delimiter[0].length),
  };
};

const quoted = value => JSON.stringify(value.replace(/[*_`]/g, "").trim());

const pageTitle = (frontmatter, body, fallback) => {
  const titleLine = frontmatter.find(line => /^title:\s*/.test(line));
  if (titleLine) {
    return titleLine
      .replace(/^title:\s*/, "")
      .replace(/^['"]|['"]$/g, "")
      .trim();
  }
  const heading = body.match(/^#\s+(.+)$/m)?.[1];
  return heading?.replace(/[*_`]/g, "").trim() || titleCase(fallback);
};

const frontmatterValue = (frontmatter, key) =>
  frontmatter
    .find(line => new RegExp(`^${key}:\\s*`).test(line))
    ?.replace(new RegExp(`^${key}:\\s*`), "")
    .replace(/^['"]|['"]$/g, "")
    .trim();

const normalizeContainers = body => {
  const lines = body.split("\n");
  const result = [];
  let container = null;
  for (const line of lines) {
    const start = line.match(/^:::\s*(warning|tip|info|danger)\s*(.*)$/i);
    if (start) {
      container = `${titleCase(start[1])}${start[2] ? ` — ${start[2]}` : ""}`;
      result.push(`> **${container}**`);
      continue;
    }
    if (container && /^:::\s*$/.test(line)) {
      container = null;
      continue;
    }
    result.push(container ? (line ? `> ${line}` : ">") : line);
  }
  return result.join("\n");
};

const normalizeMarkdownHeadings = (body, title) => {
  let insideFence = false;
  let fenceMarker = null;
  let removedPageHeading = false;
  const normalizedTitle = title.replace(/[*_`]/g, "").trim().toLowerCase();

  return body
    .split("\n")
    .map(line => {
      const fence = line.match(/^\s*(```+|~~~+)/);
      if (fence) {
        const marker = fence[1][0];
        if (!insideFence) {
          insideFence = true;
          fenceMarker = marker;
        } else if (marker === fenceMarker) {
          insideFence = false;
          fenceMarker = null;
        }
        return line;
      }

      if (insideFence || !/^#\s+/.test(line)) return line;
      const normalizedHeading = line
        .replace(/^#\s+/, "")
        .replace(/[*_`]/g, "")
        .trim()
        .toLowerCase();
      if (!removedPageHeading && normalizedHeading === normalizedTitle) {
        removedPageHeading = true;
        return "";
      }
      return `#${line}`;
    })
    .join("\n");
};

const normalizeMermaidSyntax = body =>
  body.replace(/```mermaid\s*\n([\s\S]*?)```/gi, (block, definition) => {
    const normalized = definition
      .replace(
        /(\b[\w-]+)\[(?!")([^\]\n]*\([^\]\n]*\)[^\]\n]*)\]/g,
        '$1["$2"]'
      )
      .replace(/\|(?!")([^|\n]*\([^|\n]*\)[^|\n]*)\|/g, '|"$1"|');
    return block.replace(definition, normalized);
  });

const normalizeLegacyContent = (body, title) => {
  const withoutFooter = body.replace(/\n?<footer>[\s\S]*?<\/footer>\s*/gi, "\n");

  return normalizeMermaidSyntax(normalizeMarkdownHeadings(withoutFooter, title))
    .replace(/utm_source=officialcto\.com/gi, "utm_source=kavriq")
    .replace(/OfficialCTO\.com[–-]ready/gi, "Kavriq-ready")
    .replace(/OfficialCTO\.com/gi, "Kavriq")
    .replace(/officialcto\.com/gi, "kavriq.com")
    .replace(/\*Official CTO\* journey/gi, "Kavriq v1 curriculum")
    .replace(/Official CTO journey/gi, "Kavriq v1 curriculum")
    .replace(/Official CTO/gi, "Kavriq")
    .replace(/OfficialCTO/g, "Kavriq")
    .replace(/com\.officialcto/g, "com.kavriq")
    .replace(/P\[Order Service \(Producer\)\]/g, 'P["Order Service (Producer)"]')
    .replace(/Note over A,B,C:/g, "Note over A,C:")
    .replace(/A\[Thread\.start\(\)\]/g, 'A["Thread.start()"]');
};

const rewriteLinks = (body, title) =>
  normalizeContainers(normalizeLegacyContent(body, title))
    .replace(
      /\/interview-section\/([a-z0-9-]+)(?=\/|\)|#|\s|$)/gi,
      "/interview/$1/v1"
    )
    .replace(/\/interview-section\/?(?=\)|#|\s|$)/gi, "/interview/software-engineering/v1")
    .replace(/\/my-works(?=\/|\)|#|\s|$)/g, "/engineering/case-studies/v1")
    .replace(
      /\/blogs\/2025\/october\/future-of-ai(?=\.md|\)|#|\s|$)(?:\.md)?/g,
      "/blogs/2025/10-06-future-of-ai"
    )
    .replace(/\/images\//g, "/images/officialcto/")
    .replace(/(\/interview\/[^)\s#]+)\.md(?=[)#\s])/g, "$1")
    .replace(/(\/engineering\/case-studies\/[^)\s#]+)\.md(?=[)#\s])/g, "$1")
    .replace(/(\/(?:interview|engineering|blogs)\/[^)\s#]+)\/index(?=[)#\s])/g, "$1");

const targetForInterview = sourceFile => {
  const rel = path.relative(interviewSource, sourceFile);
  const parts = rel.split(path.sep);
  if (rel === "index.md") return path.join(interviewTarget, "software-engineering/v1/index.md");
  if (parts.length === 1) {
    const stem = parts[0].replace(/\.md$/, "");
    if (stem === "lld_old") return path.join(interviewTarget, "lld/v1/legacy.md");
    return path.join(interviewTarget, stem, "v1/index.md");
  }
  return path.join(interviewTarget, parts[0], "v1", ...parts.slice(1));
};

const migratePage = (sourceFile, targetFile) => {
  const source = fs.readFileSync(sourceFile, "utf8").replace(/\r\n/g, "\n");
  const { frontmatter, body } = splitFrontmatter(source);
  const title = pageTitle(frontmatter, body, path.basename(sourceFile));
  const retained = frontmatter
    .filter(
      line =>
        !/^(title|layout|sidebar):\s*/.test(line) &&
        !/^repo:\s*.*your-profile\//i.test(line) &&
        line.trim() !== ""
    )
    .map(line =>
      line
        .replace(/\/images\//g, "/images/officialcto/")
        .replace(/OfficialCTO\.com/gi, "Kavriq")
        .replace(/officialcto\.com/gi, "kavriq.com")
        .replace(/Official CTO/gi, "Kavriq")
        .replace(/OfficialCTO/g, "Kavriq")
        .replace(/com\.officialcto/g, "com.kavriq")
    );
  const layout = path.relative(path.dirname(targetFile), layoutsPath).replaceAll(path.sep, "/");
  const nextFrontmatter = [
    `title: ${quoted(title)}`,
    ...retained,
    `layout: ${layout}`,
    'contentStatus: "Migrated legacy content; review pending"',
  ];
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(
    targetFile,
    `---\n${nextFrontmatter.join("\n")}\n---\n\n${rewriteLinks(body, title).trim()}\n`
  );
};

const migrateBlogPost = ({ sourceRelative, targetRelative, pubDatetime, tags }) => {
  const sourceFile = path.join(docsRoot, "blogs", sourceRelative);
  const targetFile = path.join(blogPostsTarget, targetRelative);
  const source = fs.readFileSync(sourceFile, "utf8").replace(/\r\n/g, "\n");
  const { frontmatter, body } = splitFrontmatter(source);
  const title = pageTitle(frontmatter, body, path.basename(sourceFile));
  const description =
    frontmatterValue(frontmatter, "description") ?? `A Kavriq article about ${title}.`;
  const nextFrontmatter = [
    `pubDatetime: ${pubDatetime}`,
    `title: ${quoted(title)}`,
    `description: ${quoted(description)}`,
    "author: Ravi Shankar",
    "tags:",
    ...tags.map(tag => `  - ${tag}`),
  ];

  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(
    targetFile,
    `---\n${nextFrontmatter.join("\n")}\n---\n\n${rewriteLinks(body, title).trim()}\n`
  );
};

for (const sourceFile of markdownFiles(interviewSource)) {
  migratePage(sourceFile, targetForInterview(sourceFile));
}

const additionalAreas = [
  {
    source: path.join(docsRoot, "my-works"),
    target: path.join(repoRoot, "src/pages/engineering/case-studies/v1"),
  },
];

for (const area of additionalAreas) {
  for (const sourceFile of markdownFiles(area.source)) {
    migratePage(sourceFile, path.join(area.target, path.relative(area.source, sourceFile)));
  }
}

const blogMigrations = [
  {
    sourceRelative: "2025/october/future-of-ai.md",
    targetRelative: "2025/10-06-future-of-ai.md",
    pubDatetime: "2025-10-06T00:00:00+05:30",
    tags: ["AI", "Future of AI"],
  },
];

for (const migration of blogMigrations) migrateBlogPost(migration);

const imagesSource = path.join(docsRoot, "public/images");
const imagesTarget = path.join(repoRoot, "public/images/officialcto");
fs.cpSync(imagesSource, imagesTarget, { recursive: true, force: true });

const topicFiles = [
  ...new Set(
    fs
      .readdirSync(interviewSource, { withFileTypes: true })
      .filter(
        entry =>
          entry.isDirectory() ||
          (entry.isFile() &&
            entry.name.endsWith(".md") &&
            !["index.md", "lld_old.md"].includes(entry.name))
      )
      .map(entry => entry.name.replace(/\.md$/, ""))
  ),
].sort();

const navItems = topicFiles.map(topic => {
  const topicSourceCandidate = path.join(interviewSource, `${topic}.md`);
  const topicSource = fs.existsSync(topicSourceCandidate)
    ? topicSourceCandidate
    : path.join(interviewSource, topic, "index.md");
  const { frontmatter, body } = splitFrontmatter(fs.readFileSync(topicSource, "utf8"));
  const item = {
    title: pageTitle(frontmatter, body, topic),
    href: `/interview/${topic}/v1`,
  };
  const topicDirectory = path.join(interviewSource, topic);
  if (!fs.existsSync(topicDirectory)) return item;

  const directPages = markdownFiles(topicDirectory).filter(file => {
    const relative = path.relative(topicDirectory, file);
    return relative !== "index.md" && relative.split(path.sep).length === 1;
  });
  const childDirectories = fs
    .readdirSync(topicDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));
  const children = directPages.map(file => {
    const rel = path.relative(topicDirectory, file).replace(/\.md$/, "");
    const parsed = splitFrontmatter(fs.readFileSync(file, "utf8"));
    return {
      title: pageTitle(parsed.frontmatter, parsed.body, rel),
      href: `/interview/${topic}/v1/${rel === "index" ? "" : rel}`.replace(/\/$/, ""),
    };
  });
  for (const directory of childDirectories) {
    const pages = markdownFiles(path.join(topicDirectory, directory.name));
    const directoryIndex = pages.find(file => path.basename(file) === "index.md");
    const pageItems = pages
      .filter(file => path.basename(file) !== "index.md")
      .map(file => {
        const slug = path.basename(file, ".md");
        const parsed = splitFrontmatter(fs.readFileSync(file, "utf8"));
        return {
          title: pageTitle(parsed.frontmatter, parsed.body, slug),
          href: `/interview/${topic}/v1/${directory.name}/${slug}`,
        };
      });
    children.push({
      title: titleCase(directory.name),
      href: directoryIndex
        ? `/interview/${topic}/v1/${directory.name}`
        : (pageItems[0]?.href ?? `/interview/${topic}/v1`),
      children: pageItems,
    });
  }
  return { ...item, children };
});

const navSource = `import type { DocsNavItem } from "./docsNav";\n\n// Generated by scripts/migrate-officialcto.mjs from the current OfficialCTO working tree.\nexport const officialCtoInterviewNav: DocsNavItem[] = ${JSON.stringify(navItems, null, 2)};\n`;
fs.writeFileSync(path.join(repoRoot, "src/data/officialCtoInterviewNav.ts"), navSource);

console.log(`Migrated ${markdownFiles(interviewSource).length} interview pages.`);
console.log(`Migrated ${blogMigrations.length} blog post.`);
console.log(`Migrated ${additionalAreas.flatMap(area => markdownFiles(area.source)).length} case-study pages.`);
console.log(`Copied ${fs.readdirSync(imagesSource).length} image entries.`);
