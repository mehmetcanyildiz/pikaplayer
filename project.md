# Xtream Player Application - Requirements and Structure (Next.js)

This document outlines all the details required for the development of the Xtream Player application using **Next.js**. The app will feature a modern, Netflix-like design, optimized for web platforms.

## Profile Creation and Selection Screen

### Profile Creation Screen
When the user first visits the application, they will be able to create a profile with the following tabs:

1. **Xtream Codes Tab**:
   - **Profile Name**: The name of the profile chosen by the user.
   - **Server**: The Xtream API server address (e.g., `http://example.com:8080`).
   - **Username**: The username for Xtream API login.
   - **Password**: The password for Xtream API.
   - The app will connect to the Xtream API with these details.

2. **M3U/M3U8 Playlist Tab**:
   - **Profile Name**: The name of the profile chosen by the user.
   - **M3U/M3U8 URL**: The URL of the M3U/M3U8 playlist provided by the user.
   - The app will fetch content from the URL.

3. **Stalker Portal Tab**:
   - **Profile Name**: The name of the profile chosen by the user.
   - **Server**: The Stalker Portal URL.
   - **MAC Address**: The device's MAC address provided by the user.
   - The app will connect to the Stalker Portal using these details.

### Profile Selection Screen
If the user has already created a profile, the profile selection screen will be shown. Each profile will have an **edit icon (pen)**, and when clicked, an action panel will appear with the following options:
- **Edit Profile**: Allows the user to edit the profile information.
- **Delete Profile**: The user will be asked for confirmation ("Are you sure?"). If confirmed, the profile will be deleted.
- **Change Profile**: If multiple profiles exist, the user can switch profiles. If no other profiles exist, they will be redirected to the profile creation screen.

## Main Screen Layout and Navigation

### Search Section
Users will be able to perform **real-time search** based on channel names, movie titles, or series titles. The search results will be shown similarly to **Netflix**.

- **Profile Icon**: Next to the search bar, a profile icon will be displayed. When clicked, a panel will open from the right side, where the user can:
  - **Download Latest Data**: Displays the date and time of the last update.
  - **Edit Profile**: Allows the user to edit their profile.
  - **Change Profile**: If there are other profiles, the user can switch profiles.
  - **Delete Profile**: The user can delete the profile.

### Live TV, Movies, Series

1. **Live TV Tab**:
   - **Favorite Channels**: If the user has favorite channels, they will be shown at the top. If there are no favorite channels, this section will be hidden.
   - **Categories**: Channels will be listed by categories. For each channel:
     - **Logo**: The channel’s logo.
     - **Channel Name**: The name of the channel.
     - **Current Program**: The program currently being aired on the channel.
     - **Add to Favorites**: A star icon will allow the user to add the channel to their favorites.

2. **Movies Tab**:
   - **Continue Watching**: If a movie is in progress, a "Continue Watching" section will appear.
   - **Categories**: Movies will be listed by categories. For each movie:
     - **Movie Poster**: The movie’s poster.
     - **Movie Title**: The title of the movie.
     - **Movie Duration**: The length of the movie.
     - **Watch Progress**: If the user has started watching, a red progress bar will show the current progress.

3. **Series Tab**:
   - **Continue Watching**: If a series episode is in progress, a "Continue Watching" section will appear.
   - **Seasons and Episodes**: Series details will be displayed by seasons and episodes. For each episode:
     - **Completion Bar**: A progress bar indicating the completion of the episode in red.

## Watch Screen

### Video Player (VLC Player)
- **Subtitles and Language Options**: Users will be able to change subtitles and language options.
- **Fast Forward/Rewind**: Users will have 10-second fast forward and rewind buttons for movies and series.
- **Playback Speed**: The user will be able to adjust the playback speed.
- **Landscape Mode**: The watch screen will only be available in landscape mode (for mobile web). On tablet, PC, and Smart TV, all screens will be landscape.

## Technologies and Structure

- **Next.js**: The app will be developed using Next.js for server-side rendering and optimal SEO performance.
- **VLC Player Integration**: Use a third-party library like [video.js](https://videojs.com/) or custom solutions to integrate VLC for streaming content.
- **Data Synchronization**: Profiles, favorites, and other data will be kept up-to-date via proper API connections.
- **Navigation**: Next.js’s built-in routing system will handle page navigation. For smooth transitions, **React Spring** or **Framer Motion** can be used for animations.

## Additional Features
- **Notifications**: The app can send notifications about new channels, movies, or series.
- **Data Updates**: Users can download new data to update the content within the app.
- **Profile Icons**: Users can add icons to their profiles.

## Requirements
- **Platforms**: The application will be a **web-based application** built with **Next.js** and will be accessible on desktop and mobile browsers.
- **UI Design**: A modern, user-friendly design similar to Netflix.
- **Database and API**: Integration with Xtream Codes API, M3U/M3U8 URLs, and Stalker Portal.

---

This Markdown file will help the development team understand all the necessary requirements and structure for the Xtream Player application, which will be developed using **Next.js**.
