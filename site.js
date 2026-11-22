const featured = {
  key: "first-crush",
  id: "v0I2UOuVj-M",
  title: "《我的搖滾青春》官方預告",
  meta: "劇情短片",
  format: "wide",
};

const videos = [
  {
    key: "jins-picnic", id: "gX7CnCWV5lw", format: "wide",
    title: "野餐我 PET 你｜音樂祭花絮",
    meta: "JINS｜活動紀錄攝影、空拍",
  },
  {
    key: "jins-florist", id: "8M6_Bvpd92w", format: "wide",
    title: "花藝師 張孟妍｜用花瓣接住每顆墜落的心",
    meta: "JINS 職人系列｜站內播放 Shorts",
    preview: { id: "Bk4cxNaaqEY", format: "short" },
  },
  {
    key: "xinhua-metal", id: "lDsvBt8NfT8", format: "wide",
    title: "鑫華金屬 形象影片",
    meta: "品牌形象｜拍攝、空拍、剪輯",
  },
  {
    key: "winston", id: "imdtbYXsr8c", format: "short",
    title: "上班族福音 六針撫平抬頭紋",
    meta: "華晟中醫",
  },
  {
    key: "beauty-brows-technique", id: "p4BQ7vRukmY", format: "short",
    title: "自信眉眼放光 專業紋繡技術",
    meta: "華韻美妍館",
  },
  {
    key: "unilions", id: "guEkF64pLwU", format: "short",
    title: "趙娟週、侯方、陳聖平",
    meta: "JINS × 統一獅｜後期製作",
  },
];

const dialog = document.querySelector("#video-dialog");
const screen = document.querySelector("#player-screen");
const youtubeLink = document.querySelector("#youtube-link");
let trigger;

function openVideo(video, button) {
  trigger = button;
  const playback = video.preview || video;
  const isShort = playback.format === "short";
  dialog.classList.toggle("is-short", isShort);
  document.querySelector("#player-title").textContent = video.title;
  document.querySelector("#player-format").textContent = video.preview ? "Shorts 試看" : isShort ? "Shorts" : "長影片";
  youtubeLink.textContent = video.preview ? "在 YouTube 觀看長版" : "在 YouTube 觀看";
  youtubeLink.href = video.url || (video.format === "short"
    ? "https://www.youtube.com/shorts/" + video.id
    : "https://www.youtube.com/watch?v=" + video.id);

  const frame = document.createElement("iframe");
  const params = new URLSearchParams({ autoplay: "1", playsinline: "1", rel: "0" });
  if (video.start) params.set("start", String(video.start));
  frame.title = video.title + "｜YouTube 播放器";
  frame.src = "https://www.youtube-nocookie.com/embed/" + playback.id + "?" + params;
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  frame.allowFullscreen = true;
  screen.replaceChildren(frame);
  dialog.showModal();
}

for (const video of videos) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.setAttribute("aria-label", "播放 " + video.title);

  const visual = document.createElement("span");
  visual.className = "card-visual";
  const image = document.createElement("img");
  image.src = "./" + video.key + ".webp";
  image.alt = "";
  image.loading = "lazy";
  const play = document.createElement("span");
  play.className = "card-play";
  play.setAttribute("aria-hidden", "true");
  const mark = document.createElement("span");
  mark.className = "play-mark";
  play.append(mark);
  visual.append(image, play);

  const meta = document.createElement("span");
  meta.className = "card-meta";
  meta.textContent = video.meta;
  const title = document.createElement("span");
  title.className = "card-title";
  title.textContent = video.title;
  card.append(visual, meta, title);
  card.addEventListener("click", () => openVideo(video, card));
  document.querySelector("#" + video.format + "-works").append(card);
}

const heroButton = document.querySelector("[data-video]");
heroButton.addEventListener("click", () => openVideo(featured, heroButton));
document.querySelector("#close-player").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => {
  screen.replaceChildren();
  trigger?.focus({ preventScroll: true });
});

const filters = [...document.querySelectorAll("[data-filter]")];
const groups = [...document.querySelectorAll("[data-format]")];
for (const button of filters) {
  button.addEventListener("click", () => {
    for (const filter of filters) filter.setAttribute("aria-pressed", String(filter === button));
    const format = button.dataset.filter;
    for (const group of groups) group.hidden = format !== "all" && group.dataset.format !== format;
    document.querySelector("#filter-status").textContent = "顯示" + button.textContent;
  });
}

const search = document.querySelector("#work-search");
const formatFilter = document.querySelector("#work-format");
const catalog = document.querySelector("#catalog-groups");
const catalogStatus = document.querySelector("#catalog-status");

function renderCatalog() {
  const term = search.value.trim().toLocaleLowerCase("zh-Hant");
  const format = formatFilter.value;
  const matching = window.portfolioVideos.filter(video =>
    (format === "all" || video.format === format) &&
    [video.title, video.series, video.detail].filter(Boolean).some(text =>
      text.toLocaleLowerCase("zh-Hant").includes(term)),
  );
  catalogStatus.textContent = matching.length ? "共 " + matching.length + " 支影片" : "找不到符合的作品。";
  const groups = new Map();
  for (const video of matching) {
    if (!groups.has(video.series)) groups.set(video.series, []);
    groups.get(video.series).push(video);
  }
  const view = document.createDocumentFragment();
  for (const [series, entries] of groups) {
    const group = document.createElement("details");
    group.className = "catalog-group";
    const heading = document.createElement("summary");
    const seriesName = document.createElement("span");
    seriesName.textContent = series;
    const count = document.createElement("span");
    count.className = "group-meta";
    count.textContent = entries.length + " 支";
    heading.append(seriesName, count);
    const list = document.createElement("ul");
    list.className = "catalog-list";
    for (const video of entries) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "catalog-play";
      button.setAttribute("aria-label", "播放 " + video.title);
      const thumbnail = document.createElement("span");
      thumbnail.className = "clip-thumbnail";
      thumbnail.setAttribute("aria-hidden", "true");
      const image = document.createElement("img");
      const imagePath = "https://i.ytimg.com/vi/" + video.id + "/";
      image.alt = "";
      image.width = 88;
      image.height = 50;
      image.loading = "lazy";
      image.decoding = "async";
      image.dataset.src = imagePath + "mqdefault.jpg";
      image.addEventListener("error", () => {
        if (image.src.endsWith("/mqdefault.jpg")) image.src = imagePath + "hqdefault.jpg";
        else image.hidden = true;
      });
      const play = document.createElement("span");
      play.className = "play-mark";
      play.setAttribute("aria-hidden", "true");
      const info = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = video.title;
      info.append(title);
      if (video.detail) {
        const detail = document.createElement("span");
        detail.className = "clip-detail";
        detail.textContent = video.detail;
        info.append(detail);
      }
      const kind = document.createElement("span");
      kind.className = "clip-format";
      kind.textContent = video.format === "short" ? "Shorts" : "長影片";
      thumbnail.append(image, play);
      button.append(thumbnail, info, kind);
      button.addEventListener("click", () => openVideo(video, button));
      item.append(button);
      list.append(item);
    }
    group.append(heading, list);
    function loadThumbnails() {
      if (!group.open) return;
      for (const image of list.querySelectorAll("img[data-src]")) {
        image.src = image.dataset.src;
        delete image.dataset.src;
      }
      group.removeEventListener("toggle", loadThumbnails);
    }
    group.addEventListener("toggle", loadThumbnails);
    group.open = Boolean(term);
    view.append(group);
  }
  catalog.replaceChildren(view);
}
search.addEventListener("input", renderCatalog);
formatFilter.addEventListener("change", renderCatalog);
renderCatalog();
