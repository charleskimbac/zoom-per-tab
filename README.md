# Zoom Per Tab (opt-in per tab)

Zoom Per Tab is a Chrome extension that lets selected tabs keep their own zoom
level. Tabs that are not selected continue to use Chrome's default per-site
zoom behavior.

## How it works

- Click the extension icon to enable separate zoom for the current tab.
- A blue `TAB` badge indicates that separate zoom is enabled.
- Click the icon again to return the tab to Chrome's per-site zoom.
- The selection follows navigation within the tab and is removed when the tab
  closes.

Chrome does not allow extensions to control zoom on restricted pages such as
`chrome://settings`.

## Install from source

1. Clone this repository:

   ```sh
   git clone https://github.com/charleskimbac/zoom-per-tab.git
   ```

2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the cloned repository.

## Usage

1. Open the tab that should have an independent zoom level.
2. Click the Zoom Per Tab extension icon.
3. Change the zoom using Chrome's menu or keyboard shortcuts.
4. Click the extension icon again when the tab should use per-site zoom.
