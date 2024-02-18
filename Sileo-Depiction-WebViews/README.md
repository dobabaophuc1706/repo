# Jailbreak Repo Web Viewer
## Generate a Cydia/Sileo Repository on a Webpage

**Includes:**
* All Package Viewer
* Package Category Sorting
* Package Category Viewer
* Sileo Depiction Viewer
* iOS Style UI
* Smooth Animations

This can be used to generate a WebView depiction for Cydia using just your SileoDepiction.json file!

### Repo Viewer

Example Available: [Here](https://pinpal.github.io/Sileo-Depiction-WebViews/repo/?repo=https://repo.packix.com/)
<br/><br/>
This is a great place to set the landing page for your repo. It will automatically handle adding all your packages as well as adding links to their respective depiction pages complete with all the available arguements.
<br/>
Simply Specify your Repo's URL in the addresss. 
For example you can view my Cydia repo in using the following arguement:

```
https://pinpal.github.io/Sileo-Depiction-WebViews/repo/?repo=https://pinpal.github.io/
```

| Property      | Description |
| ------------- | ------------- |
| repo          | URL of Cydia Repo  |

### Depiction Viewer

Example Available: [Here](https://pinpal.github.io/Sileo-Depiction-WebViews/?json=https://raw.githubusercontent.com/PINPAL/Sileo-Depiction-WebViews/996b2b375b0c61bcb3af61ee518488c1c670fccb/packages/shortlook/config.json&name=Shortlook&dev=Dynastic&price=3.99&icon=https://raw.githubusercontent.com/PINPAL/Sileo-Depiction-WebViews/996b2b375b0c61bcb3af61ee518488c1c670fccb/packages/shortlook/icon.png&section=Tweaks)
<br/><br/>
Simply Specify your SileoDepiction JSON file in the address.
You can also add other optional arguements seperated by an and (&) symbol for a more complete depiction eg:
```
https://pinpal.github.io/Sileo-Depiction-WebViews/?json=https://pinpal.github.io/package/Example/SileoDepiction.json&name=Example&dev=PINPAL
```

| Property      | Description |
| ------------- | ------------- |
| json          | URL of SileoDepiction JSON file  |
| name          | Tweak Title  |
| dev          | Tweak Developer  |
| price          | Tweak Price (Integer)  |
| section          | Tweak Section (Eg: Tweaks/Themes)  - used to generate generic icon|
| icon          | Tweak Icon - overrides tweak section  |
