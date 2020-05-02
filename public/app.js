import Router from '/Router.js';
//import EmbeddedDocument from '/EmbeddedDocument.js';

// Initiate service worker

// Setup routing

const router = new Router({ mode: 'history', root: '/' });
router.add(/document\/(.*)/, (id) => { loadDocument(`${id}`); })
    .add(/lang\/(.*)/, (id) => { setLanguage(`${id}`); })
    .add(/category\/(.*)/, (id) => { setCategory(`${id}`); })
    .add('', () => { /* Do nothing */ });

// Global variables to track application state

let selectedLanguage = '';
let selectedCategory = 'all';

// Add event listeners

document.addEventListener('DOMContentLoaded', () => {
    updateMenu(selectedCategory);
    updateDocumentList(selectedCategory);
    translateContent(selectedLanguage);
});

// Navigation drawer animation

const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});

// UI translation

function translateContent(lang) {
    let content = document.querySelectorAll('span[lang]');
    Array.from(content).map(item => {
        if (item.attributes.lang.value === lang) {
            item.hidden = false;
        } else {
            item.hidden = true;
        }
    });

    const frenchLink = document.getElementById('french-link');
    const englishLink = document.getElementById('english-link');

    if (lang === 'fr') {
        window.document.title = "Documents LAKANA";
        englishLink.classList.remove("mdc-list-item--activated");
        frenchLink.classList.remove("mdc-list-item--activated");
        frenchLink.classList.add("mdc-list-item--activated");
    } else {
        window.document.title = "LAKANA Documents";
        frenchLink.classList.remove("mdc-list-item--activated");
        englishLink.classList.remove("mdc-list-item--activated");
        englishLink.classList.add("mdc-list-item--activated");
    }
    selectedLanguage = lang;
}

function setLanguage(language) {
    window.selectedLanguage = language;
    window.selectedCategory = '';
    translateContent(language);
}

// Update menu

function updateMenu(selectedCategory) {
    const menu = window.document.getElementById('menu');
    menu.innerHTML = createMenuItem({ "en": "All documents", "fr": "Tous les documents"}, 'collections', 'all', selectedCategory === 'all');
    fetch('/content.json').then((response) => {
        response.json().then((data) => {
            data.categories.forEach((item) => {
                let selected = item.id === selectedCategory ? true : false;
                menu.innerHTML += createMenuItem(item.category, item.icon, item.id, selected);
            });
            document.getElementById('release-number').innerHTML = data['release-number'];
            document.getElementById('release-date').innerHTML = data['release-date'];
            translateContent('en');
        })
    });
}

function createMenuItem(menuText, menuIcon, menuId, selected) {
    let selectedClass = selected === true ? 'mdc-list-item--activated' : '';
    return `
    <a class="mdc-list-item ${selectedClass}" href="/category/${menuId}">
      <i class="material-icons mdc-list-item__graphic">${menuIcon}</i>
      <span class="mdc-list-item__text">
        <span lang="en">${menuText.en}</span>
        <span lang="fr">${menuText.fr}</span>
      </span>
    </a>
    `;
}

// Update document list

function updateDocumentList(category) {
    const documents = document.getElementById('documents');
    documents.innerHTML = '';
    fetch('/content.json').then((response) => {
        response.json().then((data) => {
            data.categories.forEach((item) => {
                if (item.id === category || selectedCategory === 'all') {                    
                    documents.innerHTML += `<h3 class="mdc-list-group__subheader">${item.category.en}</h3>`;
                    item.documents.forEach(
                        (listItem) => {
                            documents.innerHTML += createListItem(
                                listItem.icon, listItem.number, listItem.title,
                                listItem.author, listItem.version, listItem.date,
                                listItem.url
                            );
                        }
                    );
                }
             });
        })
    });
}

function createListItem(icon, number, title, author, version, date, url) {
    const id = url.substring(0, url.indexOf('.html'));
    return ` <li>
        <a class="mdc-list-item" href="/document/${id}">
            <span style="margin-right:20px;">
                <i class="material-icons mdl-list__item-avatar">${icon}</i>
            </span>
            <span class="mdc-list-item__text">
                <span class="mdc-list-item__primary-text">${number}: ${title.en}</span>
                <span class="mdc-list-item__secondary-text">${author} <em>(Version: ${version} - ${date})</em></span>
            </span>
        </a>
    </li>
    <li role="separator" class="mdc-list-divider"></li>`;
}

function setCategory(category) {
    selectedCategory = category;
    updateDocumentList(category);
    updateMenu(selectedCategory);
}

// Update content

function closeDocument() {
    const doc = document.getElementById('document');
    const documentList = document.getElementById('documentList');
    doc.innerHTML = '';
    documentList.hidden = false;
}


function loadDocument(page) {
    console.log(page);
    // if (page != '') {
    //     const content = document.getElementById('document');
    //     content.innerHTML = page;
    // }
}

function openDocument(url, version, date) {
 alert('click');
}


