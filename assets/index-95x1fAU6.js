var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function createElement({
  tag,
  classNames = [],
  textContent,
  onClick,
  ...attributes
}) {
  const $element = document.createElement(tag);
  classNames.forEach((className) => $element.classList.add(className));
  if (textContent) {
    $element.textContent = textContent;
  }
  if (onClick && typeof onClick === "function") {
    $element.onclick = onClick;
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "required") {
      $element.required = Boolean(value);
    } else {
      $element.setAttribute(key, value);
    }
  });
  return $element;
}
function $(selector) {
  return document.querySelector(selector);
}
function Modal(component) {
  const $modal = createElement({
    tag: "div",
    classNames: ["modal", "modal--open"]
  });
  const $modalBackdrop = createElement({
    tag: "div",
    classNames: ["modal-backdrop"]
  });
  const $modalContainer = createElement({
    tag: "div",
    classNames: ["modal-container"]
  });
  $modalBackdrop.addEventListener("click", () => {
    removeModal();
  });
  document.addEventListener("keydown", handleEscKeyDown);
  document.body.appendChild($modal);
  $modalContainer.appendChild(component());
  $modal.appendChild($modalBackdrop);
  $modal.appendChild($modalContainer);
}
function handleEscKeyDown(event) {
  if (event.key === "Escape") {
    removeModal();
  }
}
function removeModal() {
  $(".modal").remove();
  document.removeEventListener("keydown", handleEscKeyDown);
}
function Select({
  name,
  id,
  classNames = [],
  options,
  values = [],
  isDefaultOption = true,
  isRequired = false
}) {
  const $select = createElement({
    tag: "select",
    name,
    id,
    classNames,
    required: isRequired
  });
  const $options = createOptions(options, values, isDefaultOption);
  $select.appendChild($options);
  return $select;
}
function createOptions(options, values, isDefaultOption) {
  const $fragment = document.createDocumentFragment();
  if (isDefaultOption) {
    const $defaultOption = createElement({
      tag: "option",
      value: "",
      textContent: "선택해 주세요."
    });
    $fragment.appendChild($defaultOption);
  }
  options.forEach((option, index) => {
    const $option = createElement({
      tag: "option",
      value: values[index] || option,
      textContent: option
    });
    $fragment.appendChild($option);
  });
  return $fragment;
}
function createHelpText(helpText) {
  const $span = createElement({
    tag: "span",
    classNames: ["help-text", "text-caption"],
    textContent: helpText
  });
  return $span;
}
function RestaurantAddModalItem({
  isRequired,
  name,
  text,
  renderChild,
  helpText
}) {
  const $div = createElement({
    tag: "div",
    classNames: ["form-item", `${isRequired && "form-item--required"}`]
  });
  const $label = createElement({
    tag: "label",
    for: `${name} text-caption`,
    textContent: text
  });
  $div.appendChild($label);
  $div.appendChild(renderChild());
  if (helpText) {
    const $helpText = createHelpText(helpText);
    $div.appendChild($helpText);
  }
  return $div;
}
function Input({ type, name, id, isRequired }) {
  const $input = createElement({
    tag: "input",
    type,
    name,
    id,
    required: isRequired
  });
  return $input;
}
function TextArea({ name, id, cols, rows }) {
  const $textarea = createElement({
    tag: "textarea",
    name,
    id,
    cols,
    rows
  });
  return $textarea;
}
function Button({ variant, type, text, onClick, className }) {
  const $button = createElement({
    tag: "button",
    classNames: ["button", `button--${variant}`, "text-caption", className],
    type,
    textContent: text,
    onClick
  });
  return $button;
}
function RestaurantAddModalButtonContainer() {
  const $div = createElement({
    tag: "div",
    classNames: ["button-container"]
  });
  $div.appendChild(
    Button({
      className: "button--cancel",
      variant: "secondary",
      type: "button",
      text: "취소하기",
      onClick: removeModal
    })
  );
  $div.appendChild(
    Button({
      className: "button--add",
      variant: "primary",
      type: "submit",
      text: "추가하기"
    })
  );
  return $div;
}
const CATEGORY_IMAGE = Object.freeze({
  한식: "./category-korean.png",
  중식: "./category-chinese.png",
  일식: "./category-japanese.png",
  양식: "./category-western.png",
  아시안: "./category-asian.png",
  기타: "./category-etc.png"
});
const _RestaurantData = class _RestaurantData {
  constructor({
    id,
    name,
    distance,
    description = "",
    link = "",
    category,
    isFavorite = false,
    src,
    alt
  }) {
    __publicField(this, "id");
    __publicField(this, "src");
    __publicField(this, "alt");
    __publicField(this, "name");
    __publicField(this, "distance");
    __publicField(this, "description");
    __publicField(this, "link");
    __publicField(this, "category");
    __publicField(this, "isFavorite");
    this.validateCategory(category);
    this.validateDistance(distance);
    this.validateName(name);
    this.validateLink(link);
    this.id = id || crypto.randomUUID();
    this.src = src || CATEGORY_IMAGE[category];
    this.alt = alt || category;
    this.name = name;
    this.distance = distance;
    this.description = description;
    this.link = link;
    this.category = category;
    this.isFavorite = isFavorite;
  }
  getData() {
    return {
      id: this.id,
      src: this.src,
      alt: this.alt,
      name: this.name,
      distance: this.distance,
      description: this.description,
      link: this.link,
      category: this.category,
      isFavorite: this.isFavorite
    };
  }
  changeFavorite() {
    this.isFavorite = !this.isFavorite;
  }
  hasInvalidNameChar(name) {
    return !/^[가-힣a-zA-Z0-9\s]+$/.test(name);
  }
  isValidateNameLength(name) {
    return name.length < 2;
  }
  isValidateLink(link) {
    return link.trim().length !== 0 && !/^(https?:\/\/)[^\s]+/.test(link);
  }
  validateCategory(category) {
    if (!category) throw Error(_RestaurantData.ERROR_MESSAGE.category);
  }
  validateDistance(distance) {
    if (!distance) throw Error(_RestaurantData.ERROR_MESSAGE.distance);
  }
  validateName(name) {
    if (this.isValidateNameLength(name)) {
      throw Error(_RestaurantData.ERROR_MESSAGE.nameLength);
    }
    if (this.hasInvalidNameChar(name)) {
      throw Error(_RestaurantData.ERROR_MESSAGE.nameChar);
    }
  }
  validateLink(link) {
    if (this.isValidateLink(link)) {
      throw Error(_RestaurantData.ERROR_MESSAGE.link);
    }
  }
};
__publicField(_RestaurantData, "ERROR_MESSAGE", Object.freeze({
  category: "카테고리를 선택해 주세요",
  distance: "거리를 선택해 주세요",
  nameLength: "식당 이름은 2글자 이상 입력해 주세요",
  nameChar: "올바른 식당 이름을 입력해 주세요.",
  link: "올바른 링크 주소를 입력해 주세요."
}));
let RestaurantData = _RestaurantData;
const DATA_KEY = "restaurantData";
function getAllData() {
  return JSON.parse(localStorage.getItem(DATA_KEY) || "[]");
}
function postData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}
const VIEW_STATE = {
  all: "모든 음식점",
  favorite: "자주 가는 음식점"
};
const CATEGORY = {
  all: "전체"
};
const SORTED = {
  name: "name",
  distance: "distance"
};
class RestaurantDataList {
  constructor() {
    __publicField(this, "dataList");
    __publicField(this, "subscribers", []);
    __publicField(this, "viewState", VIEW_STATE.all);
    __publicField(this, "sortedFlag", SORTED.name);
    __publicField(this, "category", CATEGORY.all);
    const restaurantDataList2 = getAllData();
    this.dataList = restaurantDataList2.map(
      (restaurantData) => new RestaurantData(restaurantData).getData()
    );
  }
  getFavoriteDataList() {
    const favoriteList = this.dataList.filter(
      (restaurantData) => restaurantData.isFavorite
    );
    return favoriteList;
  }
  getDataById(id) {
    return this.dataList.find(
      (restaurantData) => restaurantData.id === id
    );
  }
  setViewState(viewState) {
    this.viewState = viewState;
  }
  setCategory(category) {
    this.category = category;
  }
  setSortedFlag(sortedFlag) {
    this.sortedFlag = sortedFlag;
  }
  addData(data) {
    const restaurantData = new RestaurantData(data);
    this.dataList.push(restaurantData.getData());
    postData(this.dataList);
  }
  changeFavorite(id) {
    const targetData = this.dataList.find(
      (restaurantData) => restaurantData.id === id
    );
    if (targetData) {
      targetData.isFavorite = !(targetData == null ? void 0 : targetData.isFavorite);
      postData(this.dataList);
    }
  }
  removeDataById(id) {
    this.dataList = this.dataList.filter((restaurant) => restaurant.id !== id);
    postData(this.dataList);
  }
  renderRestaurantList() {
    const restaurantDataList2 = this.viewState === VIEW_STATE.favorite ? this.getFavoriteDataList() : this.dataList;
    if (this.category === CATEGORY.all) {
      this.notify(this.sortedDataList(restaurantDataList2));
      return;
    }
    const filteredList = restaurantDataList2.filter(
      (restaurantData) => restaurantData.category === this.category
    );
    const sortedFilteredList = this.sortedDataList(filteredList);
    this.notify(sortedFilteredList);
  }
  sortedDataList(dataList) {
    if (this.sortedFlag === SORTED.distance) {
      dataList.sort((a, b) => a.distance - b.distance);
    } else {
      dataList.sort((a, b) => a.name > b.name ? 1 : -1);
    }
    return dataList;
  }
  subscribe(callback) {
    this.subscribers.push(callback);
  }
  notify(data) {
    this.subscribers.forEach((callback) => callback(data));
  }
}
const restaurantDataList = new RestaurantDataList();
const CATEGORY_OPTIONS = ["한식", "중식", "일식", "양식", "아시안", "기타"];
const DISTANCE_OPTIONS = ["5분 내", "10분 내", "15분 내", "20분 내", "30분 내"];
function RestaurantAddModal() {
  const $fragment = document.createDocumentFragment();
  const $h2 = createElement({
    tag: "h2",
    classNames: ["modal-title", "text-title"],
    textContent: "새로운 음식점"
  });
  const $form = createElement({
    tag: "form",
    classNames: ["restaurant-add-form"]
  });
  const formItems = createFormItems();
  $form.addEventListener("submit", createRestaurantItem);
  $form.append(...formItems);
  $form.appendChild(RestaurantAddModalButtonContainer());
  $fragment.appendChild($h2);
  $fragment.appendChild($form);
  return $fragment;
}
function createRestaurantItem(event) {
  try {
    event.preventDefault();
    const restaurantData = Object.fromEntries(new FormData(event.target));
    console.log(restaurantData);
    restaurantDataList.addData(restaurantData);
    restaurantDataList.renderRestaurantList();
    removeModal();
  } catch (e) {
    alert(e.message);
  }
}
function createFormItems() {
  return [
    {
      isRequired: true,
      name: "category",
      text: "카테고리",
      renderChild: () => Select({
        name: "category",
        id: "category",
        options: CATEGORY_OPTIONS,
        isRequired: true
      })
    },
    {
      isRequired: true,
      name: "name",
      text: "이름",
      renderChild: () => Input({ type: "text", name: "name", id: "name", isRequired: true })
    },
    {
      isRequired: true,
      name: "distance",
      text: "거리(도보 이동 시간)",
      renderChild: () => Select({
        name: "distance",
        id: "distance",
        options: DISTANCE_OPTIONS,
        values: ["5", "10", "15", "20", "30"],
        isRequired: true
      })
    },
    {
      isRequired: false,
      name: "description",
      text: "설명",
      renderChild: () => TextArea({
        name: "description",
        id: "description",
        cols: "30",
        rows: "5"
      }),
      helpText: "메뉴 등 추가 정보를 입력해 주세요"
    },
    {
      isRequired: false,
      name: "link",
      text: "참고 링크",
      renderChild: () => Input({ type: "text", name: "link", id: "link", isRequired: false }),
      helpText: "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
    }
  ].map((formItem) => {
    return RestaurantAddModalItem(formItem);
  });
}
function RestaurantHeader({ title }) {
  const $header = createElement({ tag: "header", classNames: ["gnb"] });
  const $title = createElement({
    tag: "h1",
    classNames: ["gnb__title", "text-title"],
    textContent: title
  });
  const $addButton = createElement({
    tag: "button",
    type: "button",
    classNames: ["gnb__button"],
    ["aria-babel"]: "음식점 추가"
  });
  const $addButtonImg = createElement({
    tag: "img",
    src: "./add-button.png",
    alt: "음식점 추가"
  });
  $addButton.addEventListener("click", () => {
    Modal(RestaurantAddModal);
  });
  $addButton.appendChild($addButtonImg);
  $header.appendChild($title);
  $header.appendChild($addButton);
  return $header;
}
function RestaurantItemCategory({ src, alt }) {
  const $category = createElement({
    tag: "div",
    classNames: ["restaurant__category"]
  });
  const $categoryImg = createElement({
    tag: "img",
    classNames: ["category-icon"],
    src,
    alt
  });
  $category.appendChild($categoryImg);
  return $category;
}
function RestaurantItemFavorite({ isFavorite, id }) {
  const $favoriteWrap = createElement({
    tag: "div"
  });
  const $favorite = createElement({
    tag: "img",
    name: "favorite__star",
    classNames: ["favorite__star"],
    src: isFavorite ? "./fill-star.png" : "./empty-star.png",
    alt: isFavorite ? "좋아요한 별" : "좋아요안한 별"
  });
  $favoriteWrap.appendChild($favorite);
  $favorite.addEventListener("click", () => {
    restaurantDataList.changeFavorite(id);
    const dataById = restaurantDataList.getDataById(id);
    $favorite.src = dataById.isFavorite ? "/public/fill-star.png" : "/public/empty-star.png";
  });
  return $favoriteWrap;
}
function RestaurantItemNameDistance({ name, distance }) {
  const $nameDistanceWrap = createElement({
    tag: "div"
  });
  const $name = createElement({
    tag: "h3",
    classNames: ["restaurant__name", "text-subtitle"],
    textContent: name
  });
  const $distance = createElement({
    tag: "span",
    classNames: ["restaurant__distance", "text-body"],
    textContent: `캠퍼스부터 ${distance}분 내`
  });
  $nameDistanceWrap.appendChild($name);
  $nameDistanceWrap.appendChild($distance);
  return $nameDistanceWrap;
}
function RestaurantDetailModal(restaurantData) {
  const $section = createElement({
    tag: "section",
    classNames: ["restaurantDetail__modal"]
  });
  const $detailInfo = createDetailInfo({ ...restaurantData });
  const $buttons = createButtons(restaurantData.id);
  $section.appendChild($detailInfo);
  $section.appendChild($buttons);
  return $section;
}
function createDetailInfo({
  id,
  src,
  alt,
  distance,
  description,
  link,
  name,
  isFavorite
}) {
  const $info = createElement({
    tag: "div",
    classNames: ["restaurantDetail__info"]
  });
  const $starWrap = createElement({
    tag: "div",
    classNames: ["restaurantDetail__star"]
  });
  const $description = createElement({
    tag: "p",
    classNames: [
      "restaurantDetail__description",
      "text-body",
      "marginTopBottom-15"
    ],
    textContent: description
  });
  const $link = createElement({
    tag: "a",
    classNames: ["restaurantDetail__link", "text-body"],
    textContent: link,
    href: link
  });
  const $category = RestaurantItemCategory({ src, alt });
  const $nameAndDistance = RestaurantItemNameDistance({ name, distance });
  const $favorite = RestaurantItemFavorite({ isFavorite, id });
  $favorite.addEventListener("click", () => {
    restaurantDataList.renderRestaurantList();
  });
  $starWrap.appendChild($favorite);
  $info.appendChild($category);
  $info.appendChild($nameAndDistance);
  $info.appendChild($starWrap);
  $info.appendChild($description);
  $info.appendChild($link);
  return $info;
}
function createButtons(id) {
  const $buttonWrap = createElement({
    tag: "div",
    classNames: ["restaurantDetail__buttonWrap"]
  });
  const $deleteButton = createElement({
    tag: "button",
    classNames: ["restaurantDetail__button", "restaurantDetail_delete"],
    textContent: "삭제하기"
  });
  const $closeButton = createElement({
    tag: "button",
    classNames: ["restaurantDetail__button", "restaurantDetail_close"],
    textContent: "닫기"
  });
  $buttonWrap.appendChild($deleteButton);
  $buttonWrap.appendChild($closeButton);
  $deleteButton.addEventListener("click", () => {
    removeModal();
    restaurantDataList.removeDataById(id);
    restaurantDataList.renderRestaurantList();
  });
  $closeButton.addEventListener("click", removeModal);
  return $buttonWrap;
}
function RestaurantItem({
  id,
  src,
  alt,
  name,
  distance,
  description,
  isFavorite
}) {
  const $restaurantItem = createElement({
    tag: "li",
    classNames: ["restaurant"],
    id
  });
  const $restaurantInfo = createElement({
    tag: "div",
    classNames: ["restaurant__info"]
  });
  const $restaurantHeader = createElement({
    tag: "div",
    classNames: ["restaurantItem__header"]
  });
  const $category = RestaurantItemCategory({ src, alt });
  const $nameDistanceWrap = RestaurantItemNameDistance({ name, distance });
  const $favoriteWrap = RestaurantItemFavorite({ isFavorite, id });
  const $description = createElement({
    tag: "p",
    classNames: ["restaurant__description", "text-body"],
    textContent: description
  });
  $restaurantHeader.appendChild($nameDistanceWrap);
  $restaurantHeader.appendChild($favoriteWrap);
  $restaurantInfo.appendChild($restaurantHeader);
  $restaurantInfo.appendChild($description);
  $restaurantItem.appendChild($category);
  $restaurantItem.appendChild($restaurantInfo);
  $restaurantItem.addEventListener("click", (event) => {
    if (event.target.name !== "favorite__star") {
      const dataById = restaurantDataList.getDataById(id);
      Modal(() => RestaurantDetailModal({ ...dataById }));
    }
  });
  return $restaurantItem;
}
function RestaurantListContainer() {
  const $restaurantListContainer = createElement({
    tag: "section",
    classNames: ["restaurant-list-container"]
  });
  const $restaurantList = createElement({
    tag: "ul",
    classNames: ["restaurant-list"]
  });
  function render(restaurantDataList2) {
    const restaurantElements = restaurantDataList2.map(
      ({ id, src, alt, name, distance, description, isFavorite }) => RestaurantItem({
        id,
        src,
        alt,
        name,
        distance,
        description,
        isFavorite
      })
    );
    $restaurantList.replaceChildren(...restaurantElements);
    $restaurantListContainer.appendChild($restaurantList);
  }
  restaurantDataList.subscribe(render);
  return $restaurantListContainer;
}
function RestaurantNav() {
  const $nav = createElement({ tag: "nav", classNames: ["restaurant-nav"] });
  const $allRestaurant = createElement({
    tag: "div",
    classNames: ["restaurant-nav-item", "text-subtitle", "select"],
    name: "all-restaurant",
    textContent: "모든 음식점"
  });
  const $favoriteRestaurant = createElement({
    tag: "div",
    classNames: ["restaurant-nav-item", "text-subtitle"],
    name: "favorite-Restaurant",
    textContent: "자주 가는 음식점"
  });
  $allRestaurant.addEventListener("click", (e) => {
    if (e.target.name === "all-restaurant") return;
    $allRestaurant.classList.add("select");
    $favoriteRestaurant.classList.remove("select");
    restaurantDataList.setViewState(VIEW_STATE.all);
    restaurantDataList.renderRestaurantList();
  });
  $favoriteRestaurant.addEventListener("click", (e) => {
    if (e.target.name === "favorite-Restaurant") return;
    $allRestaurant.classList.remove("select");
    $favoriteRestaurant.classList.add("select");
    restaurantDataList.setViewState(VIEW_STATE.favorite);
    restaurantDataList.renderRestaurantList();
  });
  restaurantDataList.renderRestaurantList();
  $nav.append($allRestaurant, $favoriteRestaurant);
  return $nav;
}
function RestaurantFilters() {
  const $filterContainer = createElement({
    tag: "section",
    classNames: ["restaurant-filter-container"]
  });
  const $categoryFilter = Select({
    name: "category",
    id: "category-filter",
    classNames: ["restaurant-filter"],
    options: ["전체", "한식", "중식", "일식", "양식", "아시안", "기타"],
    isDefaultOption: false
  });
  const $sortingFilter = Select({
    name: "sorting",
    id: "sorting-filter",
    classNames: ["restaurant-filter"],
    options: ["이름순", "거리순"],
    values: ["name", "distance"],
    isDefaultOption: false
  });
  $categoryFilter.addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    restaurantDataList.setCategory(selectedCategory);
    restaurantDataList.renderRestaurantList();
  });
  $sortingFilter.addEventListener("change", (event) => {
    const selectedSorting = event.target.value;
    restaurantDataList.setSortedFlag(selectedSorting);
    restaurantDataList.renderRestaurantList();
  });
  $filterContainer.append($categoryFilter, $sortingFilter);
  return $filterContainer;
}
function RestaurantApp() {
  const $restaurantHeader = RestaurantHeader({ title: "점심 뭐 먹지" });
  const $restaurantFilters = RestaurantFilters();
  const $restaurantListContainer = RestaurantListContainer();
  const $restaurantNav = RestaurantNav();
  document.body.appendChild($restaurantHeader);
  document.body.appendChild($restaurantNav);
  document.body.appendChild($restaurantFilters);
  document.body.appendChild($restaurantListContainer);
}
window.addEventListener("load", () => {
  RestaurantApp();
});
