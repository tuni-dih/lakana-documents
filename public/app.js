import Router from '/Router.js';
import EmbeddedDocument from '/EmbeddedDocument.js';

// Initiate service worker

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/service-worker.js')
//     .then((registration) => console.log('Service worker registered'))
//     .catch((error) => console.log('Service worker not registered', error));
// }

// Setup routing

const router = new Router({ mode: 'hash', root: '/' });
router.add(/document\/(.*)/, (id) => { loadDocument(`${id}`); })
    .add(/lang\/(.*)/, (id) => { setLanguage(`${id}`); })
    .add(/category\/(.*)/, (id) => { setCategory(`${id}`); })
    .add('', () => { 
        document.getElementById('documents').hidden = false;
        document.getElementById('document').innerHTML = '';
     });

// Global variables to track application state

let selectedLanguage = 'en';
let selectedCategory = 'all';

// Add event listeners

document.addEventListener('DOMContentLoaded', () => {
    updateMenu(selectedCategory);
    updateDocumentList(selectedCategory);
    translateContent(selectedLanguage);

});

document.getElementById('english-link').addEventListener('click', (event) => {
    event.preventDefault();
    translateContent('en');
    drawer.open = false;

});

document.getElementById('french-link').addEventListener('click', (event) => {
    event.preventDefault();
    translateContent('fr');
    drawer.open = false;
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
    selectedLanguage = language;
    selectedCategory = '';
    translateContent(language);
    console.log('Language ' + language)
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
            translateContent(selectedLanguage);
            const links = document.querySelectorAll('.category-link');
            links.forEach((element) => {
                element.addEventListener('click', () => {
                    drawer.open = false;
                })
            })
        })
    });
}

function createMenuItem(menuText, menuIcon, menuId, selected) {
    let selectedClass = selected === true ? 'mdc-list-item--activated' : '';
    return `
    <a class="category-link mdc-list-item ${selectedClass}" href="/#/category/${menuId}">
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
        <a class="mdc-list-item" href="/#/document/${id}">
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
    closeDocument();
}

// Update content

function loadDocument(page) {
    const fileName = page + '.html';  

    // TODO: Get document version and date

    let version ='0.1', versionDate = '2020-05-06';

     fetch(`/content/${fileName}`).then(
        (response) => response.text()).then(
            (html) => {
                const doc = document.getElementById('document');
                const documentList = document.getElementById('documents');
                doc.innerHTML = `               
                    <div style="margin-left:20px; margin-top:20px; margin-bottom:0px">
                    <div class="mdc-chip" role="row" style="align: right;">
                        <div class="mdc-chip__ripple"></div>
                        <i class="material-icons mdc-chip__icon mdc-chip__icon--leading">refresh</i>
                        <span role="gridcell">
                            <span role="button" tabindex="0" class="mdc-chip__primary-action">
                                <span class="mdc-chip__text">Version: ${version}</span>
                            </span>
                        </span>
                    </div>
                    <div class="mdc-chip" role="row" style="align: right;">
                        <div class="mdc-chip__ripple"></div>
                        <i class="material-icons mdc-chip__icon mdc-chip__icon--leading">today</i>
                        <span role="gridcell">
                            <span role="button" tabindex="0" class="mdc-chip__primary-action">
                                <span class="mdc-chip__text">Updated: ${versionDate}</span>
                            </span>            
                        </span>
                    </div>
                 </div>
                `;
                doc.innerHTML += html;
                documentList.hidden = true;

                var embeddedDocuments = document.querySelectorAll("embedded-document");         
                let items = Array.from(embeddedDocuments).map(elem => {
                const incName = elem.src;
                fetch(`./content/${incName}`).then(
                    (response) => response.text().then(
                        (incHtml) => {
                            elem.innerHTML = incHtml;
                        })
                    )}
                );
        doc.innerHTML += ` <div style="margin-left:20px; margin-bottom:40px;"> <button class="mdc-button mdc-button--raised" id="btn-close">
                            <span class="mdc-button__ripple"></span>
                                <span lang="en">Close document</span>
                                <span lang="fr">Fermer le document</span>
                            </button></div>`;
    }).then(
        () => {
            const btnClose = document.getElementById('btn-close');
            btnClose.addEventListener('click', (event) => {
                closeDocument();
                window.location.href = '#';
              
            });
            translateContent(selectedLanguage);
        });
    }

    async function getDocumentVersionInformation(page) {
        const fileName = page + '.html';  
        let version, versionDate;
        fetch('/content.json').then((response) => {
            response.json().then((data) => {
                data.categories.forEach((category) => {
                 category.documents.forEach((document) => {
                     if (document.url === fileName) {
                        version = document.version;
                        versionDate = document.date;
                        
                        return [ version, versionDate ];
                     }
                 })
               })
            })
        });
        
    }

    function closeDocument() {
        document.getElementById('documents').hidden = false;
        document.getElementById('document').innerHTML = '';
    }
