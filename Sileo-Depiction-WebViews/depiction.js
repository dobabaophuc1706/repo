// Define Popup (Improve Popup Responsiveness)
const modifyPopup = document.getElementById("modifyPopup")
const popupButtonWrapper = document.getElementsByClassName('popupButtonWrapper')[0]

// Define Navbar Items (Improve Scrolling Animation Responsiveness)
const navbar = document.getElementsByClassName("navbar")[0]
const bannerNavItems = document.getElementById("bannerNavItems")
const changedNavbarItems = document.getElementsByClassName("changedNavbarItems")[0]

// Define BannerImage (Improve Scrolling Animation Responsiveness)
const bannerImage = document.getElementById("bannerImage")

// Get Tweak Name from URL
var tweakName = "Tweak Name"
if (getQueryVariable("name") != null) {
    tweakName = decodeURI(getQueryVariable("name"))
}
// Generate Tweak Icon from Section in URL
var tweakIcon = returnIcon(getQueryVariable("section"))

// Get Tweak Icon from URL
if (getQueryVariable("icon") != null) {
    tweakIcon = decodeURI(getQueryVariable("icon"))
}

// Get Developer and Price from URL
const tweakDeveloperName = decodeURI(getQueryVariable("dev"))
const tweakPrice = decodeURI(getQueryVariable("price"))

// Get Sileo Depiction JSON URL from URL Arguement
const jsonDirectory = getQueryVariable("json")
// Fetch Sileo Depiction JSON and Render it
getSileoDepiction(jsonDirectory)

// Function to Load Sileo JSON File (Async)
async function getSileoDepiction(URL) {
    var sileoDepictionJSON = null
    try {
        sileoDepictionJSON = JSON.parse((await corsBypass(URL)))
        // Render Sileo Depiction
        renderSileoDepiction(sileoDepictionJSON)
    } catch (error) {
        // Create Error Warning Message at top of content
        var errorWarning = document.createElement("div")
            errorWarning.className = "errorWarning"
            errorWarning.innerText = "Failed to load SileoDepiction JSON File"
        document.getElementById("mainWrapper").appendChild(errorWarning)
        console.log(error)
    }
    // Hide the reloading indicator
    document.getElementById("reloadingRepoWrapper").style.display = "none"
}

// Set Navbar Tweak Icon
document.getElementById("navbarTweakIcon").style.backgroundImage = "url(" + tweakIcon + ")"

// Set Price Buttons
for (i=0; i<document.getElementsByClassName("priceButton").length;i++) {
    if (/[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/.test(tweakPrice)) {
        document.getElementsByClassName("priceButton")[i].innerText = "$" + tweakPrice
    }
}

// Set Tweak Name
document.getElementById("tweakName").innerText = tweakName
// Set Developer Name
document.getElementById("developerName").innerText = tweakDeveloperName
// Set Tweak Icon
document.getElementById("tweakIcon").style.backgroundImage = "url(" + tweakIcon + ")"
// Set Page Title
document.getElementById("websiteTitle").innerText = tweakName
// Set Page Icon
document.getElementById("websiteIcon").href = tweakIcon

//Set Back Arrows 
for (i=0; i<2; i++) {
    document.getElementsByClassName("backURL")[i].href = document.referrer
}

//Generate from Config Function
function renderSileoDepiction(config) {
        // Show Pill Selector
        document.getElementsByClassName("headerPillSelector")[0].style.visibility = "visible"
        // Set Background Color
        if (config.hasOwnProperty('backgroundColor')) {
            document.getElementsByTagName('html')[0].style.setProperty("--bg-color", config.backgroundColor)
        }
        // Set Tint Color
        if (config.hasOwnProperty('tintColor')) {
            document.getElementsByTagName('html')[0].style.setProperty("--tint-color", config.tintColor)
        }
        // Set Banner Image
        if (config.hasOwnProperty('headerImage')) {
            bannerImage.style.backgroundImage = "url(" + config.headerImage + ")"
            bannerImage.style.filter = "brightness(0.5)";
            bannerImage.style.webkitFilter = "brightness(0.5)";
        }
        // Clear Tabs
        var pillTextsArray = document.getElementsByClassName("pillText")
        for (i=0; i<pillTextsArray.length; i++) {
            pillTextsArray[i].parentElement.removeChild(pillTextsArray[i])
        }
        // Generate Tabs
        for (currentTab = 0; currentTab < config.tabs.length; currentTab++) {
            // Create Pill Selectors at Top
            var pillText = document.createElement("div")
            pillText.className = "pillText"
            pillText.id = config.tabs[currentTab].tabname + "Button"
            pillText.innerText = config.tabs[currentTab].tabname
            pillText.setAttribute("onclick", "changePillSelector(this)")
            pillText.style.left = (50 / config.tabs.length) * (2 * currentTab + 1) + "%"
            document.getElementsByClassName("headerPillSelector")[0].appendChild(pillText)
            // Create Tab for Content to Go In
            var tabContent = document.createElement("div")
            tabContent.className = "tabContent"
            tabContent.id = config.tabs[currentTab].tabname + "Content"
            // Add Content Views to Tab
            for (currentViewNum = 0; currentViewNum < config.tabs[currentTab].views.length; currentViewNum++) {
                var view = handleView(config.tabs[currentTab].views[currentViewNum], false)
                tabContent.appendChild(view)
            }
            // Handle Landscape Oreintation of StackViews
            var landscapeOrientationObjects = document.getElementsByClassName("landscapeOrientation")
            // Loop Every Single Landscape StackView
            for (i = 0; i < landscapeOrientationObjects.length; i++) {
                // Loop Every Child View within the StackView
                for (j = 0; j < landscapeOrientationObjects[i].childNodes.length; j++) {
                    landscapeOrientationObjects[i].childNodes[j].style.display = "inline-block"
                    landscapeOrientationObjects[i].childNodes[j].style.width = "50%"
                }
            }
            // Add Tab Content to MainWrapper
            document.getElementById("mainWrapper").appendChild(tabContent)
            // Initial Styling of Pill Selector (Page Load)
            document.getElementsByClassName("pillText")[0].style.color = "var(--tint-color)"
            document.getElementsByClassName("pillSelectorLine")[0].style.left = (50 / config.tabs.length) + "%"
            // Initial Display of Main Content
            document.getElementsByClassName("tabContent")[0].style.display = "block"
        }
}


// Scroll Snapping to Bottom of Banner
var isScrolling;
// Listen for scroll events
window.addEventListener('scroll', function ( event ) {
    // Clear our timeout throughout the scroll
    window.clearTimeout( isScrolling );
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function() {
        // Run the callback
        var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        if (scrollTop < 204 && scrollTop > 104) {
            window.scrollTo(0,154)
        }
    }, 66);
}, false);

// Navbar & Banner Scrolling Animation
window.addEventListener('scroll', function updateNavbar() {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    navbar.style.opacity = scrollTop / 150
    bannerNavItems.style.opacity = 1 - (scrollTop / 100)
    // Banner Enlargement (When Users Scrolls into Negative - Mobile Browsers)
    if (scrollTop >= 0) {
        bannerImage.style.position = "absolute"
        bannerImage.style.minHeight = "200px"
    } else {
        bannerImage.style.position = "fixed"
        bannerImage.style.minHeight = 200 + (scrollTop * -1) + "px"
    }
    // Only show right/center navbar items after 150 pixels of scroll
    if (scrollTop > 150) {
        changedNavbarItems.style.opacity  = 1
    } else {
        changedNavbarItems.style.opacity  = 0
    }
})

// Load Dark Mode from Cookie
if (getCookie("enableDarkMode")) {
    document.getElementById("enableDarkMode").classList.add("enabledToggle")
}

// Modify Button
function modifyButton() {
    disableScroll()
    modifyPopup.style.visibility = "visible"
    modifyPopup.style.backgroundColor = "rgba(0,0,0,0.6)"
    popupButtonWrapper.style.transform = "translate(-50%, 0%)"
}
// Hide popup when clicking on background ONLY (prevent propagation of onClick)
modifyPopup.addEventListener("click", function (e) {
    e = window.event || e;
        if (this === e.target) {
            hidePopup()
        }
});
// Function to hide popup messages
function hidePopup() {
    popupButtonWrapper.style.transform = "translate(-50%, calc(100% + 10px))"
    modifyPopup.style.backgroundColor = "rgba(0,0,0,0)"
    enableScroll()
    setTimeout(function(){modifyPopup.style.visibility = "hidden"}, 350);
}

//Functions for enabling and disabling scrolling
var keys = {37: 1, 38: 1, 39: 1, 40: 1};
function preventDefault(e) {
e = e || window.event;
if (e.preventDefault)
    e.preventDefault();
e.returnValue = false;  
}
function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}
function disableScroll() {
if (window.addEventListener) // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    document.addEventListener('wheel', preventDefault, {passive: false}); // Disable scrolling in Chrome
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
}
function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
        document.removeEventListener('wheel', preventDefault, {passive: false}); // Enable scrolling in Chrome
        window.onmousewheel = document.onmousewheel = null; 
        window.onwheel = null; 
        window.ontouchmove = null;  
        document.onkeydown = null; 
}

// Switch between Details and Changelog
function changePillSelector(element) {
    // Reset color of all Pill Texts
    pillTexts = document.getElementsByClassName("pillText")
    for (i=0; i<pillTexts.length; i++) {
        pillTexts[i].style.color = "var(--medium-text-color)"
    }
    // Hide all Tab Content
    tabContents = document.getElementsByClassName("tabContent")
    for (i=0; i<tabContents.length; i++) {
        tabContents[i].style.display = "none"
    }
    // Move Pill Selector Line
    document.getElementsByClassName("pillSelectorLine")[0].style.left = element.style.left
    // Set Color of Selected Pill text 
    element.style.color = "var(--tint-color)"
    // Show Tab Content
    document.getElementById(element.id.slice(0,-6) + "Content").style.display = "block"
}

//Function for displaying overlay popup
function displayOverlayPopup(element) {
    if (element.innerText == "About") {
        document.getElementById("aboutInfo").style.display = "block"
        hidePopup()
    } else if (element.className == "screenshot") {
        var largerScreenshot = element.cloneNode(true)
        largerScreenshot.removeAttribute("onclick")
        largerScreenshot.style.cursor = "auto"
        largerScreenshot.classList.add("largerScreenshot")
        // Fix Screenshot View inside Zebra
        if (navigator.userAgent.toLowerCase().includes("zebra")) {
            largerScreenshot.classList.add("largeZebraFix")
        }
        document.getElementById("overlayPopupContent").appendChild(largerScreenshot)
    } else if (element.innerText == "Configure") {
        document.getElementById("configureSettings").style.display = "block"
        hidePopup()
    }
    disableScroll()
    document.getElementById("everythingWrapper").classList.add("blurred")
    document.getElementById("overlayPopup").style.transform = "translateY(0%)"
}
function hideOverlayPopup() {
    enableScroll()
    setTimeout(function(){
        document.getElementById("overlayPopupContent").innerHTML = ""
        document.getElementById("aboutInfo").removeAttribute("style")
        document.getElementById("configureSettings").removeAttribute("style")
    }, 350);
    document.getElementById("everythingWrapper").classList.remove("blurred")
    document.getElementById("overlayPopup").style.transform = "translateY(100%)"
}

// Function for sharing the package
function sharePackage() {
    navigator.share({
        title: tweakName,
        text: "Get " + tweakName,
        url: window.location.href,
    });
}

// Function for toggling settings
function toggleSetting(element) {
    if (element.className == "toggleSwitch enabledToggle") {
        // Make Toggle Disabled
        element.classList.remove("enabledToggle")
    } else {
        // Make Toggle Enabled
        element.classList.add("enabledToggle")
    }
    // If Dark Mode
    if (element.id == "enableDarkMode") {
        toggleDarkMode()
    }
}

// Fixes for Cydia's WebView
if (navigator.userAgent.toLowerCase().includes("cydia")) {
    document.getElementsByClassName("leftNavButton")[0].style.display = "none"
    popupButtonWrapper.style.bottom = "calc(100% - 300px)"
}
function screenshotViewCydia(element) {
    window.location.href = 
        "https://sileotweak.github.io/Sileo-Depiction-WebViews/screenshotViewCydia/?image=" 
        + element.src 
        + "&back="
        + window.location.href
}