🕐 24h → 12h Time Converter (Site-Limited Chrome Extension)

A lightweight browser extension that automatically converts 24-hour times (e.g. 14:30) into 12-hour AM/PM format (e.g. 2:30 PM) — but only on the websites you choose.

Perfect for users who prefer 12-hour time or have trouble mentally converting 24-hour format when browsing the web.

✨ Features

🕓 Automatically detects and converts visible 24-hour times to 12-hour AM/PM format.

🌐 Runs only on the sites you specify (no unnecessary or global modifications).

🔄 Works on dynamically updated pages using a MutationObserver.

💬 Shows the original 24-hour time as a tooltip on hover.

⚡ Lightweight — no external libraries, no tracking, no network requests.

📁 Files
File	Purpose
manifest.json	Chrome extension manifest — controls permissions and target sites.
content-script.js	Main script that scans pages and converts time formats.
icon48.png (optional)	Extension icon (used in the Chrome toolbar).
🧩 Installation (Developer Mode)

Download or clone this repository.

Open your Chromium-based browser (Chrome, Edge, Brave, etc.).

Go to chrome://extensions/.

Enable Developer Mode (top right).

Click Load unpacked and select the folder containing this project.

Visit one of the target websites you added to the manifest — times like 14:00 or 23:45 should now appear as 2:00 PM and 11:45 PM.

⚙️ Configuration

By default, the extension is limited to specific websites defined in your manifest.json file:

"matches": [
  "*://example.com/*",
  "*://sub.example.org/*",
]


You can add or remove sites by editing this list.
Use wildcards (*://*.example.com/*) to include all subdomains.

Then reload the extension:

Go to chrome://extensions/

Click the refresh icon 🔄 on your extension card

💡 Notes & Limitations

The script avoids converting:

Text inside <script>, <style>, <code>, or input fields.

Obvious sports scores (like 2:1).

On sites that update content dynamically, it automatically re-checks every few seconds.

Works best with plain time strings like 14:00, 09:30, etc.

🧰 Example Conversion
Before	After
14:00	2:00 PM
00:15	12:15 AM
23:45	11:45 PM

Hovering the converted text shows the original 24-hour time as a tooltip.

🧠 How It Works

Injects a content script into matched sites.

Uses regex to detect 24-hour timestamps.

Rewrites them in the DOM as 12-hour format with AM/PM.

Continuously monitors for dynamically added text using a MutationObserver.

🪪 License

MIT License — feel free to modify, fork, and share!

💬 Credits

Created with ❤️ to make reading time on the web easier for everyone who prefers the 12-hour clock.
