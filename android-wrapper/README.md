# ZXH OFFICIAL Android Wrapper

A lightweight Android WebView shell for the existing ZXH OFFICIAL TOOLKIT website.

## What it does
- Loads the existing website without rebuilding or redesigning its frontend.
- Uses ZXH Pink `#FF2D8D` for the Android status bar and system navigation bar.
- Uses white system navigation icons.
- Supports Android Back navigation inside the WebView.
- Supports HTML file selection inputs.
- Opens external HTTP(S) links in the user's browser.

## Website URL
The current start URL is configured in `app/src/main/java/com/zxh/official/MainActivity.kt`:
`https://zxh-official-tools.pages.dev/`

## Build an APK from a phone
1. Open the repository on GitHub.
2. Switch to branch `zxh-android-wrapper`.
3. Open **Actions** and select **Build ZXH Android APK**.
4. Run the workflow using **Run workflow**.
5. When it completes, open the run and download the `ZXH-OFFICIAL-TOOLKIT-APK` artifact.
6. Extract the ZIP and install `app-debug.apk` on Android. Allow installation from that source if Android asks.

The workflow builds a debug APK. It is suitable for personal testing; a signed release APK/AAB should be created separately before public Play Store distribution.

## Compatibility
- Minimum Android: 6.0 (API 23)
- Target SDK: 34
- Java: 17
- Gradle: 8.9
