
// Define Constants
const featuredBannersView = document.getElementById("FeaturedBannersView")
const categoryExpandView = document.getElementById("categoryExpandView")
const categoryList = document.getElementById("categoryList")
const backArrow = document.getElementsByClassName("backArrow")[0]
const backArrowText = document.getElementById("backArrowText")
const reloadingRepoText = document.getElementById("reloadingRepoText")

// Function to Fetch Content from Repo
async function getRepo(repoURL) {
    // Fetch Repo Title from Repo Release File
    var repoTitle = "Repo Title"
    try {
        repoTitle = (await corsBypass(repoURL + "Release")).match(/Origin:.*/)[0].replace(/Origin:\s/g,"")
    } catch (error) {}
    // Set Repo Title
    document.getElementById("websiteTitle").innerText  = repoTitle
    document.getElementById("repositoryName").innerText  = repoTitle
    document.getElementsByClassName("leftNavButton")[0].id = repoTitle
    // Update Loading Progress Text
    reloadingRepoText.innerText = "Fetching Packages"
    // Fetch Packages File from Repo
    var packages = null
    try {
        // Get Packages File from Repo
        var packagesFile = await corsBypass(repoURL + "Packages")
        // Decode Packages File into Object Array
        packages = decodePackagesFile(packagesFile)
        // Render Packages Cateogories
        renderPackagesFile(packages)
    } catch (error) {
        throw "Failed to load Packages"
    }
    // Update Loading Progress Text
    reloadingRepoText.innerText = "Fetching Sileo Featured"
    // Fetch Sileo Featured JSON from Repo
    var sileoFeaturedJSON = null
    try {
        sileoFeaturedJSON = JSON.parse((await corsBypass(repoURL + "sileo-featured.json")))
        // Render Sileo Featured
        renderSileoFeatured(sileoFeaturedJSON, packages)
    } catch (error) {}
    // Hide the reloading indicator
    document.getElementById("reloadingRepoWrapper").style.display = "none"
}

// Get Repo URL from URL Variable
var repoURL = getQueryVariable("repo")
// Validate Repo URL
if (repoURL) {
    // Show the reloading indicator
    document.getElementById("reloadingRepoWrapper").style.display = "inline"
    // Append slash to end of repo URL (if required)
    if (repoURL.slice(-1) != "/") {
        repoURL += "/"
    }
    // Fetch Contents of Repo (Asyncronously)
    getRepo(repoURL)
    // Set Page Icon
    document.getElementById("websiteIcon").href  = repoURL + "CydiaIcon.png"
} else {
    // If Repo URL not set show welcome message
    document.getElementById("welcomeWrapper").style.display = "inline"
}

// Render Packages File
function renderPackagesFile(packages) {
    if (packages != null) {

        // Set total packages (All Categories)
        const numOfPackages = packages.length
        document.getElementById("totalPackages").innerText = numOfPackages

        // Render other categories and tweak counts
        var categories = returnCategoryCount(packages)
        for (i=0; i<categories.length; i++) {
            // Define TableButtonView
            var tableButtonView = document.createElement("div")
            tableButtonView.className = "tableButtonView"
            tableButtonView.id = "categoryName" + i
            tableButtonView.setAttribute("onclick","openCategory(this)")
            tableButtonView.innerHTML = '<div class="backwardsArrow"></div>'
            // Create Category Title
            var categoryTitle = document.createElement("span")
            categoryTitle.className = "left"
            categoryTitle.innerText = categories[i].name
            // Create Category Icon 
            var categoryIcon = document.createElement("img")
            categoryIcon.className = "tweakIcon"
            categoryIcon.src = returnIcon(categories[i].name)       
            // Create Category Tweak Count
            var categoryTweakCount = document.createElement("span")
            categoryTweakCount.className = "right"
            categoryTweakCount.innerText = categories[i].tweakCount
            // Append TableButtonView to TableList
            tableButtonView.appendChild(categoryIcon)
            tableButtonView.appendChild(categoryTitle)
            tableButtonView.appendChild(categoryTweakCount)
            categoryList.appendChild(tableButtonView)
        }

        // Render other categories sub pages
        for (i=0; i<categories.length; i++) {
            var categorySubView = document.createElement("div")
            categorySubView.className = "categorySubView"
            categorySubView.id = "categorySubView" + i
            // Iterate through all packages
            for (j=0; j<packages.length; j++) {
                // Select Packages that are of specific category
                if (packages[j].Section == categories[i].name) {
                    // Define TableButtonView
                    var tableButtonView = document.createElement("div")
                    tableButtonView.className = "tableButtonView"
                    tableButtonView.innerHTML = '<div class="backwardsArrow"></div>'
                    // Create Link Element around TableButtonView
                    var tableCellLink = document.createElement("a")
                    // Add Sileo Depiction JSON URL to HREF
                    if (packages[j].hasOwnProperty("SileoDepiction")) {
                        tableCellLink.href = "../?json=" + packages[j].SileoDepiction
                        // Add Package Name to HREF
                        if (packages[j].hasOwnProperty("Name")) {
                            tableCellLink.href += "&name=" + packages[j].Name
                        }
                        // Add Section to HREF
                        if (packages[j].hasOwnProperty("Section")) {
                            tableCellLink.href += "&section=" + packages[j].Section
                        }
                        // Add Developer to HREF
                        if (packages[j].hasOwnProperty("Author")) {
                            //Replace to remove emails in triangular brackets
                            tableCellLink.href += "&dev=" + packages[j].Author.replace(/\<.*\>/g,"") 
                        }
                        // Add Icon to HREF
                        if (packages[j].hasOwnProperty("Icon")) {
                            tableCellLink.href += "&icon=" + packages[j].Icon
                        }
                    } 
                    // Add Regular Depiction link to HREF (if no SileoDepiction found)
                    else {
                        if (packages[j].hasOwnProperty("Depiction")) {
                            tableCellLink.href = packages[j].Depiction
                        }
                    }
                    // Create Tweak Title
                    var tweakTitle = document.createElement("span")
                    tweakTitle.className = "left"
                    tweakTitle.innerText = packages[j].Name
                    // Create Tweak Icon 
                    var tweakIcon = document.createElement("img")
                    tweakIcon.className = "tweakIcon"
                    // Set Tweak Icon Source (If applicable)
                    if (packages[j].hasOwnProperty("Icon")) {
                        tweakIcon.src = packages[j].Icon
                    } else {
                        tweakIcon.src = returnIcon(packages[j].Section)
                    }
                    // Create Tweak Version
                    var tweakVersion = document.createElement("span")
                    tweakVersion.className = "right"
                    tweakVersion.innerText = packages[j].Version
                    // Append to Featured View
                    tableButtonView.appendChild(tweakTitle)
                    tableButtonView.appendChild(tweakVersion)
                    tableButtonView.appendChild(tweakIcon)
                    tableCellLink.appendChild(tableButtonView)
                    categorySubView.appendChild(tableCellLink)
                }
            }
            // Append TableCell to CategorySubView Page
            categoryExpandView.appendChild(categorySubView)
        }
    }
}

// Render Sileo Featured
function renderSileoFeatured(sileoFeaturedJSON, packages) {
    if (sileoFeaturedJSON != null) {
        // Define Banner Image
        var bannerImage = document.createElement("div")
        with (bannerImage) {
            className = "bannerImage"
            style.borderRadius = sileoFeaturedJSON.itemCornerRadius + "px"
            style.width = sileoFeaturedJSON.itemSize.replace(/\{|\,.*\}/g,"") + "px"
            style.height = sileoFeaturedJSON.itemSize.replace(/\{.*\,|\}|\s/g,"") + "px"
        }

        // Generate Sileo Featured as HTML
        for (i=0; i<sileoFeaturedJSON.banners.length; i++) {
            // Create Banner
            var bannerImageClone = bannerImage.cloneNode(true)
            bannerImageClone.style.backgroundImage = "url('" + sileoFeaturedJSON.banners[i].url + "')"
            // Create Tweak Name Text
            var bannerTweakName = document.createElement("div")
            bannerTweakName.className = "bannerTweakName"
            bannerTweakName.innerText = sileoFeaturedJSON.banners[i].title
            // Disable Shadow (If Specified in JSON)
            if (sileoFeaturedJSON.banners[i].hideShadow) {
                bannerImageClone.style.boxShadow = "none"
                bannerTweakName.style.textShadow = "none"
            }
            // Append Tweak Name Text to BannerImage
            bannerImageClone.appendChild(bannerTweakName)
            // Get HREF URL from Packages File
            var alreadyAppended = false
            if (packages != null) {
                for (packageNum=0; packageNum<packages.length; packageNum++) {
                    if (packages[packageNum].Package == sileoFeaturedJSON.banners[i].package) {
                        // Create Link Element around BannerImage
                        var bannerImageLink = document.createElement("a")
                        // Add Sileo Depiction JSON URL to HREF
                        if (packages[packageNum].hasOwnProperty("SileoDepiction")) {
                            bannerImageLink.href = "../?json=" + packages[packageNum].SileoDepiction
                            // Add Package Name to HREF
                            if (packages[packageNum].hasOwnProperty("Name")) {
                                bannerImageLink.href += "&name=" + packages[packageNum].Name
                            }
                            // Add Section to HREF
                            if (packages[packageNum].hasOwnProperty("Section")) {
                                bannerImageLink.href += "&section=" + packages[packageNum].Section
                            }
                            // Add Developer to HREF
                            if (packages[packageNum].hasOwnProperty("Author")) {
                                //Replace to remove emails in triangular brackets
                                bannerImageLink.href += "&dev=" + packages[packageNum].Author.replace(/\<.*\>/g,"") 
                            }
                            // Add Icon to HREF
                            if (packages[packageNum].hasOwnProperty("Icon")) {
                                bannerImageLink.href += "&icon=" + packages[packageNum].Icon
                            }
                        } 
                        // Add Regular Depiction link to HREF (if no SileoDepiction found
                        else {
                            if (packages[packageNum].hasOwnProperty("Depiction")) {
                                bannerImageLink.href = packages[packageNum].Depiction
                            }
                        }
                        // Append to Featured View
                        bannerImageLink.appendChild(bannerImageClone)
                        featuredBannersView.appendChild(bannerImageLink)
                        // Set alreadyAppended to prevent bannerImageClone from being appended later
                        alreadyAppended = true
                    }
                }
            }
            // Append to Featured View (if couldn't find link in packages file)
            if (!alreadyAppended) {
                featuredBannersView.appendChild(bannerImageClone)
            }
        }
    }
}


// Function triggered when user taps on category
function openCategory(element) {
    var categoryID = element.id
    categoryID = categoryID.substring(12, categoryID.length)
    document.getElementsByClassName("leftNavButton")[0].setAttribute("onclick","back(" + categoryID + ")")
    document.getElementById("categorySubView" + categoryID).style.display = "inline-block"
    document.getElementById("repositoryName").innerText = element.getElementsByClassName("left")[0].innerText
    featuredBannersView.style.transform = "translateX(-100vw)"
    categoryExpandView.style.transform = "translateX(0)"
    categoryList.style.transform = "translateX(-100vw)"
    backArrowText.style.transform = "translateX(0)"
    backArrow.style.opacity = 1
    backArrowText.style.opacity = 1
}

function back(categoryID) {
    document.getElementById("categorySubView" + categoryID).style.display = "none"
    document.getElementById("repositoryName").innerText = document.getElementsByClassName("leftNavButton")[0].id
    featuredBannersView.style.transform = "translateX(0)"
    categoryExpandView.style.transform = "translateX(100vw)"
    categoryList.style.transform = "translateX(0)"
    backArrowText.style.transform = "translateX(35px)"
    backArrow.style.opacity = 0
    backArrowText.style.opacity = 0
}