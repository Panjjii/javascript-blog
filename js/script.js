'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector("#template-tag-link").innerHTML),
  articleAuthorLink: Handlebars.compile(document.querySelector("#template-author-link").innerHTML)
}

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;

  console.log(event);
  console.log('clickedElement (with plus): ' + clickedElement);

  /*[DONE] remove class 'active' from all article links */
 
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [IN PROGRESS] add class 'active' to the clicked link */

  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts .active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */

  const articleAttribute = clickedElement.getAttribute('href');
  console.log(articleAttribute);

  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleAttribute);
  console.log(targetArticle);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optTagsListSelector = '.post-tags .list',
  optTagsCloudList = '.sidebar .tags',
  optAuthorsCloudList = '.sidebar .authors';

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  console.log('Title list: ', titleList);
 
  function clearTitleLinks(){
    titleList.innerHTML = '';
  }
  clearTitleLinks();

  console.log(customSelector);
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for(let article of articles){
    console.log(article);

    /* get the article id */

    const articleId = article.getAttribute('id');{
      console.log(articleId);
    }
   
    /* find the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* get the title from the title element */

    console.log('Title: ',articleTitle);
  
    /* create HTML of the link */

    const linkHTML = '<li><a href="#'+ articleId +'"><span>'+ articleTitle +'</span></a></li>';
    console.log(linkHTML);

    /* insert link into titleList */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);

 
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

const calculateTagsParams = function (allTags) {

  const params = {
    max: 0,
    min: 99999
  };

  for (let tag in allTags) {
    if (allTags[tag] > params.max) {
      params.max = allTags[tag];
    }
    if (allTags[tag] < params.min) {
      params.min = allTags[tag];
    }
  }
  return params;
};

const calculateTagClass = function (count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (5 - 1) + 1);

  return 'tag-size-' + classNumber;
};

const generateTags = function () {

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const tagsList = article.querySelector(optTagsListSelector);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const tags = articleTags.split(' ');
    for (let tag of tags) {
      const linkHTMLData = { tag: tag };
      const linkHTML = templates.tagLink(linkHTMLData);
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    tagsList.innerHTML = html;
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsCloudList);
  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  console.log(tagsParams);

  /* [NEW] START LOOP: for each tag in allTags: */
  const allTagsData = { tags: [] };

  for (let tag in allTags) {
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }

  /* [NEW] create variable for all links HTML code */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
};

function tagClickHandler(event) {

  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */

  for (const link of activeLinks) {

    /* remove class active */

    link.classList.remove('active');

    /* END LOOP: for each active tag link */

  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const relatedLinks = document.querySelectorAll('a[href="#tag-' + tag + '"]');

  /* START LOOP: for each found tag link */

  for (const tagLink of relatedLinks) {

    /* add class active */

    tagLink.classList.add('active');

    /* END LOOP: for each found tag link */

  }

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */

  const allTagLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */

  for (const tagLink of allTagLinks) {

    /* add tagClickHandler as event listener for that link */

    tagLink.addEventListener('click', tagClickHandler);

    /* END LOOP: for each link */
  }
}

function generateAuthors() {
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (const article of articles) {
    const authorWrapper = article.querySelector('p.post-author');
    const author = article.getAttribute('data-author');
    const linkHTMLData = { author: author };
    const html = templates.authorLink(linkHTMLData);
    authorWrapper.innerHTML = html;

    if (!allAuthors[author]) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }


    const authorsList = document.querySelector(optAuthorsCloudList);
    const allAuthorsData = { authors: [] };
    for (let author in allAuthors) {
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
      });
    }

    authorsList.innerHTML = templates.authorList(allAuthorsData);
  }
}
function authorClickHandler(event) {

  event.preventDefault();

  const clickedElement = this;

  const href = clickedElement.getAttribute('href');

  const author = href.replace('#author-', '');

  const activeLinks = document.querySelectorAll('a.active[href^="#author-"]');

  for (const link of activeLinks) {

    link.classList.remove('active');

  }

  const relatedLinks = document.querySelectorAll('a[href="#author-' + author + '"]');

  for (const link of relatedLinks) {

    link.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');
}


function addClickListenersToAuthors() {
  const allAuthorLinks = document.querySelectorAll('a[href^="#author-"]');

  for (const link of allAuthorLinks) {

    link.addEventListener('click', authorClickHandler);

  }

}

generateTitleLinks();
generateTags();
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();