import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';
import { Inject } from '@angular/core';
import { Category } from '../category';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user';

@Component({
  selector: 'app-content-list-view',
  templateUrl: './content-list-view.component.html',
  styleUrls: ['./content-list-view.component.css']
})
export class ContentListViewComponent implements OnInit {
  // general contents for viewing
  contents: Content[] = [];

  // content created by the current user
  myContributions: Content[] = [];

  // categories for the general contents view
  categories: Category;

  // shared between myContributions and content list
  numberOfEntriesPerPage = 20;

  // for content list pagination
  selectedCategory: String = '';
  selectedSection: String = '';
  currentPageNumber = 1;

  // for my contributions pagination
  myContributionsCurrentPageNumber = 1;

  // search variables
  searchQuery: String = '';

  // sorting variables
  sortResultsBy: String = 'relevance';
  sortOptions = ['relevance', 'upload date', 'rating'];

  // signed in user
  currentUser: User;

  constructor(private contentService: ContentService, private authService: AuthService) { }

  ngOnInit() {
    const self = this;
    this.authService.getUserData(['username']).
      subscribe(function (user) {
        self.currentUser = user.data;
        if (self.currentUser) {
          self.getMyContributionsPage();
        }
      });
    this.getSearchContentPage();
    this.getCategories();
  }

  // respond to user scrolling to the end of the general content
  onScroll(): void {
    console.log('scrolled!!');
    // increment the page number
    this.currentPageNumber += 1;

    // update the content array
    this.getSearchContentPage();
  }

  // respond to user scrolling to the end of the my contributions section
  onScrollMyContributions(): void {
    console.log('scrolled!!');
    // increment the page number
    this.myContributionsCurrentPageNumber += 1;

    // update the content array
    this.getMyContributionsPage();
  }

  // get a page of the content created by the current user
  getMyContributionsPage(): void {
    const self = this;
    this.contentService.
      getContentByCreator(self.numberOfEntriesPerPage, self.myContributionsCurrentPageNumber).
      subscribe(function (retrievedContents) {
        // append a new page to the myContributions array
        self.myContributions = self.myContributions.concat(retrievedContents.data.docs);
        console.log('Get Contributions');
      });
  }

  // retrieve the categories from the server
  getCategories(): void {
    const self = this;
    this.contentService.getCategories()
      .subscribe(function (retrievedCategories) {
        self.categories = retrievedCategories.data;
      });
  }

  // respond to the user changing the current category and section
  changeCategoryAndSection(category: any, section: any): void {
    // user changed the category or section, nullifying the validity of his search query
    this.searchQuery = '';

    // intialize category/section browsing
    this.selectedCategory = category;
    this.selectedSection = section;

    // start from page 1
    this.currentPageNumber = 1;
    this.contents = [];
    this.getSearchContentPage();
  }

  // respond to the user clicking the search button
  searchContent(): void {
    // reset contents array
    this.contents = [];
    this.currentPageNumber = 1;

    // get first page of search content
    this.getSearchContentPage();
  }

  // retrieve a page of content that matches the search query
  getSearchContentPage(): void {
    const self = this;
    // remove unnecessary spaces
    this.searchQuery = this.searchQuery.trim();

    // print statements for debugging
    console.log('Query Tags: ' + this.searchQuery);
    console.log('Retrieving Page: ' + this.currentPageNumber);

    // retrieve search page from the server
    this.contentService.getSearchPage(
      self.currentPageNumber,
      self.numberOfEntriesPerPage,
      self.searchQuery,
      self.selectedCategory,
      self.selectedSection,
      self.sortResultsBy
    ).subscribe(function (retrievedContents) {
      // update the contents array
      self.contents = self.contents.concat(retrievedContents.data.docs);
      console.log('Total Number of Pages Search: ' + retrievedContents.data.pages);
    });
  }
}
