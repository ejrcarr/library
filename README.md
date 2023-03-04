# library
Live link: <a href="https://ejrcarr.github.io/library/">Library</a>
## Context
I wanted to create an application to be able to track previously read books. Therefore, users have the ability to create new books to track, mark books read or unread, edit exisiting books, search books, filter by genre, and delete books. You can search existing books as well with the search bar. The app is fully responsive and works on mobile. 

Created with HTML, CSS, and Vanilla JS. I plan to feature an authentication service with Firebase or to store the entered books and preferred theme in local storage. 

## UI Demonstration
### Desktop
<p align='center'>
  <img width='700px' src='https://user-images.githubusercontent.com/110308975/222870399-48bb23df-a3a2-49ae-924c-02d51fd806ea.gif'/>
</p>

### Mobile
<p align='center'>
  <img width='300px' src='https://user-images.githubusercontent.com/110308975/222870564-377bd85f-0a72-4880-a735-436ffde81064.gif'/>
</p>

## Features
This app features an options to add, update, and delete books.
### Add book
<ul>
  <li>Book Title</li>
  <li>Book Author(s)</li>
  <li>Number of Pages</li>
  <li>Genres</li>
</ul>

### Update
Clicking the pencil icon on the upper right of any existing book directs to a form with filled in information from the existing book the user wants to edit. Making any edit and confirming will change book display. 
### Delete
Pops up a confirmation window to confirm if the user really wants to do that action.
### Search
Allows user to find books based on a search query. Shows a search results text above books found with an option close button. 
### Genres
User has an option to filter out books in their library by selecting one or more genres. To view all, select the All button to cancel any active genre filters. 
